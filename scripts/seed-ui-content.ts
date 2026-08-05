import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Payload } from "payload";

import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES
} from "../config/supported-locales.js";

const LOCALES = SUPPORTED_LOCALES;
type TLocale = (typeof LOCALES)[number];

type TUiGlobalSlug =
	| "header"
	| "footer"
	| "ui-common"
	| "ui-catalog"
	| "ui-discovery"
	| "ui-login";

const ROOT_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	".."
);
const MESSAGES_DIR = path.join(ROOT_DIR, "messages");

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: { isSeed: true } as const
};

const SEED_LOCALE_AVAILABILITY_DEFAULTS: Record<
	string,
	{ label: string; enabled: boolean; showInDropdown: boolean }
> = {
	en: { label: "English", enabled: true, showInDropdown: true },
	ru: { label: "Русский", enabled: true, showInDropdown: true },
	uz: { label: "Oʻzbek", enabled: true, showInDropdown: true },
	es: { label: "Español", enabled: false, showInDropdown: false },
	de: { label: "Deutsch", enabled: false, showInDropdown: false },
	fr: { label: "Français", enabled: false, showInDropdown: false },
	it: { label: "Italiano", enabled: false, showInDropdown: false },
	pt: { label: "Português", enabled: false, showInDropdown: false },
	nl: { label: "Nederlands", enabled: false, showInDropdown: false },
	pl: { label: "Polski", enabled: false, showInDropdown: false },
	tr: { label: "Türkçe", enabled: false, showInDropdown: false },
	ar: { label: "العربية", enabled: false, showInDropdown: false },
	zh: { label: "中文", enabled: false, showInDropdown: false },
	ja: { label: "日本語", enabled: false, showInDropdown: false },
	ko: { label: "한국어", enabled: false, showInDropdown: false },
	hi: { label: "हिन्दी", enabled: false, showInDropdown: false }
};

function toCamelCase(key: string): string {
	return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function convertKeysDeep<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => convertKeysDeep(item)) as T;
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, nested]) => [
				toCamelCase(key),
				convertKeysDeep(nested)
			])
		) as T;
	}

	return value;
}

function buildSeedLocaleAvailability() {
	return Object.fromEntries(
		SUPPORTED_LOCALES.map((code) => [
			code,
			SEED_LOCALE_AVAILABILITY_DEFAULTS[code] ?? {
				label: code,
				enabled: code === DEFAULT_LOCALE,
				showInDropdown: code === DEFAULT_LOCALE
			}
		])
	);
}

async function hasMessageBundle(locale: string): Promise<boolean> {
	try {
		await fs.access(path.join(MESSAGES_DIR, locale));
		return true;
	} catch {
		return false;
	}
}

async function loadMessageFile<T>(
	locale: TLocale,
	fileName: string
): Promise<T> {
	const filePath = path.join(MESSAGES_DIR, locale, fileName);
	const raw = await fs.readFile(filePath, "utf8");

	return JSON.parse(raw) as T;
}

function buildHeaderUiTexts(header: Record<string, unknown>) {
	const nav = (header.public as Record<string, unknown> | undefined)?.nav as
		| Record<string, unknown>
		| undefined;

	if (!nav) {
		return { public: { nav: {} } };
	}

	const destinations = nav.destinations as Record<string, unknown> | undefined;
	const routes = nav.routes as Record<string, unknown> | undefined;
	const experiences = nav.experiences as Record<string, unknown> | undefined;
	const information = nav.information as Record<string, unknown> | undefined;
	const userMenu = header.user_menu as Record<string, unknown> | undefined;

	return {
		public: {
			nav: {
				destinations: convertKeysDeep(destinations ?? {}),
				routes: convertKeysDeep(routes ?? {}),
				experiences: convertKeysDeep(experiences ?? {}),
				information: convertKeysDeep(information ?? {}),
				mobileMenu: nav.mobile_menu,
				comingSoon: nav.coming_soon
			}
		},
		userMenu: convertKeysDeep(userMenu ?? {})
	};
}

function buildUiLogin(login: Record<string, unknown>) {
	return convertKeysDeep(login);
}

function buildFooterUiTexts(footer: Record<string, unknown>) {
	return {
		brand: convertKeysDeep(footer.brand ?? {}),
		community: convertKeysDeep(footer.community ?? {}),
		comingSoon: footer.coming_soon,
		copyright: footer.copyright
	};
}

function buildUiCommon(
	common: Record<string, unknown>,
	footer: Record<string, unknown>,
	options?: { includeLocaleAvailability?: boolean }
) {
	return {
		...(options?.includeLocaleAvailability
			? { localeAvailability: buildSeedLocaleAvailability() }
			: {}),
		meta: convertKeysDeep(footer.meta ?? {}),
		...convertKeysDeep(common)
	};
}

function buildUiCatalog(catalog: Record<string, unknown>) {
	return convertKeysDeep(catalog);
}

function buildUiDiscovery(
	discovery: Record<string, unknown>,
	company: Record<string, unknown>,
	destinationsLabel: string
) {
	const blog = convertKeysDeep(discovery.blog ?? {});
	const routes = convertKeysDeep(discovery.routes ?? {});
	const experiences = convertKeysDeep(discovery.experiences ?? {});
	const news = convertKeysDeep(company.news ?? {});
	const tradeFairs = convertKeysDeep(company.trade_fairs ?? {});

	return {
		geoBreadcrumbLabel: destinationsLabel,
		paginationAriaLabel: "Pagination",
		blog,
		routes,
		experiences,
		news,
		tradeFairs
	};
}

async function updateGlobalLocale(
	payload: Payload,
	slug: TUiGlobalSlug,
	locale: TLocale,
	data: Record<string, unknown>
) {
	// Partial uiTexts updates must keep required localized array fields
	// (columns / navItems), otherwise Payload validates them as empty.
	let nextData = data;

	if (slug === "footer" || slug === "header") {
		const existing = await payload.findGlobal({
			slug,
			locale,
			depth: 0,
			...SEED_OP_OPTS
		});

		if (slug === "footer" && Array.isArray(existing?.columns)) {
			nextData = {
				...data,
				columns: existing.columns
			};
		}

		if (slug === "header") {
			nextData = {
				...data,
				...(existing?.logo != null ? { logo: existing.logo } : {}),
				...(Array.isArray(existing?.navItems)
					? { navItems: existing.navItems }
					: {}),
				...(Array.isArray(existing?.informationAreas)
					? { informationAreas: existing.informationAreas }
					: {}),
				...(Array.isArray(existing?.userMenuItems)
					? { userMenuItems: existing.userMenuItems }
					: {})
			};
		}
	}

	await payload.updateGlobal({
		slug,
		data: nextData,
		locale,
		draft: false,
		...SEED_OP_OPTS
	});
}

export async function seedUiContent(payload: Payload): Promise<void> {
	console.log("Seeding UI content globals...");

	for (const locale of LOCALES) {
		if (!(await hasMessageBundle(locale))) {
			console.log(`  ~ skip ui content locale ${locale} (no messages/)`);
			continue;
		}

		const [header, footer, common, catalog, discovery, company, login] =
			await Promise.all([
				loadMessageFile<Record<string, unknown>>(locale, "header.json"),
				loadMessageFile<Record<string, unknown>>(locale, "footer.json"),
				loadMessageFile<Record<string, unknown>>(locale, "common.json"),
				loadMessageFile<Record<string, unknown>>(locale, "catalog_page.json"),
				loadMessageFile<Record<string, unknown>>(
					locale,
					"discovery_page.json"
				),
				loadMessageFile<Record<string, unknown>>(locale, "company_page.json"),
				loadMessageFile<Record<string, unknown>>(locale, "login_page.json")
			]);

		const headerUiTexts = buildHeaderUiTexts(header);
		const footerUiTexts = buildFooterUiTexts(footer);
		const destinationsLabel = (
			(header.public as Record<string, unknown> | undefined)?.nav as
				| Record<string, unknown>
				| undefined
		)?.destinations as Record<string, unknown> | undefined;

		await updateGlobalLocale(payload, "header", locale, {
			uiTexts: headerUiTexts
		});
		await updateGlobalLocale(payload, "footer", locale, {
			uiTexts: footerUiTexts
		});
		await updateGlobalLocale(
			payload,
			"ui-common",
			locale,
			buildUiCommon(common, footer, {
				includeLocaleAvailability: locale === DEFAULT_LOCALE
			})
		);
		await updateGlobalLocale(
			payload,
			"ui-catalog",
			locale,
			buildUiCatalog(catalog)
		);
		await updateGlobalLocale(
			payload,
			"ui-discovery",
			locale,
			buildUiDiscovery(
				discovery,
				company,
				String(destinationsLabel?.label ?? "Destinations")
			)
		);
		await updateGlobalLocale(
			payload,
			"ui-login",
			locale,
			buildUiLogin(login)
		);

		console.log(`  + ui content locale ${locale}`);
	}
}
