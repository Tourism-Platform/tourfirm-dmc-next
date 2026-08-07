import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Payload } from "payload";

import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES
} from "../config/supported-locales.js";
import { convertKeysDeep } from "./seed/lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "./seed/lib/load-ui-text.js";
import { UI_TEXTS_DIR } from "./seed/lib/paths.js";
import { updateGlobalLocale } from "./seed/lib/update-global.js";
import { seedUiBooking } from "./seed/seeders/ui-booking.js";
import { seedUiCatalog } from "./seed/seeders/ui-catalog.js";
import { seedUiLogin } from "./seed/seeders/ui-login.js";
import { seedUiOrders } from "./seed/seeders/ui-orders.js";
import { seedUiPreview } from "./seed/seeders/ui-preview.js";

const LOCALES = SUPPORTED_LOCALES;
type TLocale = (typeof LOCALES)[number];

const ROOT_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	".."
);
const MESSAGES_DIR = path.join(ROOT_DIR, "messages");

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

async function loadLegacyMessageFile<T>(
	locale: TLocale,
	fileName: string
): Promise<T> {
	const filePath = path.join(MESSAGES_DIR, locale, fileName);
	const raw = await fs.readFile(filePath, "utf8");

	return JSON.parse(raw) as T;
}

async function loadJsonSource<T>(
	locale: TLocale,
	fileName: string
): Promise<T | null> {
	if (await hasUiTextFile(locale, fileName)) {
		return loadUiTextFile<T>(locale, fileName);
	}

	try {
		return await loadLegacyMessageFile<T>(locale, fileName);
	} catch {
		return null;
	}
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

function buildUiTours(catalog: Record<string, unknown>) {
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

export async function seedUiContent(payload: Payload): Promise<void> {
	console.log("Seeding legacy UI content globals (messages/ui-texts)...");

	for (const locale of LOCALES) {
		const hasMessages = await hasMessageBundle(locale);
		const hasUiTexts = await fs
			.access(path.join(UI_TEXTS_DIR, locale))
			.then(() => true)
			.catch(() => false);

		if (!hasMessages && !hasUiTexts) {
			console.log(`  ~ skip ui content locale ${locale} (no sources)`);
			continue;
		}

		const [header, footer, common, catalog, discovery, company] =
			await Promise.all([
				loadJsonSource<Record<string, unknown>>(locale, "header.json"),
				loadJsonSource<Record<string, unknown>>(locale, "footer.json"),
				loadJsonSource<Record<string, unknown>>(locale, "common.json"),
				loadJsonSource<Record<string, unknown>>(locale, "tours_page.json"),
				loadJsonSource<Record<string, unknown>>(locale, "discovery_page.json"),
				loadJsonSource<Record<string, unknown>>(locale, "company_page.json")
			]);

		if (header) {
			await updateGlobalLocale(payload, "header", locale, {
				uiTexts: buildHeaderUiTexts(header)
			});
		}

		if (footer) {
			await updateGlobalLocale(payload, "footer", locale, {
				uiTexts: buildFooterUiTexts(footer)
			});
		}

		if (common && footer) {
			await updateGlobalLocale(
				payload,
				"ui-common",
				locale,
				buildUiCommon(common, footer, {
					includeLocaleAvailability: locale === DEFAULT_LOCALE
				})
			);
		}

		if (catalog) {
			await updateGlobalLocale(
				payload,
				"ui-tours",
				locale,
				buildUiTours(catalog)
			);
		}

		if (discovery && company && header) {
			const destinationsLabel = (
				(header.public as Record<string, unknown> | undefined)?.nav as
					| Record<string, unknown>
					| undefined
			)?.destinations as Record<string, unknown> | undefined;

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
		}

		console.log(`  + legacy ui content locale ${locale}`);
	}

	await seedUiLogin(payload);
	await seedUiPreview(payload);
	await seedUiBooking(payload);
	await seedUiCatalog(payload);
	await seedUiOrders(payload);
}

export { seedUiPreview } from "./seed/seeders/ui-preview.js";
export { seedUiLogin } from "./seed/seeders/ui-login.js";
export { seedUiBooking } from "./seed/seeders/ui-booking.js";
export { seedUiCatalog } from "./seed/seeders/ui-catalog.js";
export { seedUiOrders } from "./seed/seeders/ui-orders.js";
export { seedUiTours } from "./seed/seeders/ui-tours.js";
export { seedToursPage } from "./seed/seeders/tours-page.js";
