import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Payload } from "payload";

const LOCALES = ["en", "ru", "uz"] as const;
type TLocale = (typeof LOCALES)[number];

type TUiGlobalSlug =
	| "header"
	| "footer"
	| "ui-common"
	| "ui-catalog"
	| "ui-discovery"
	| "ui-widgets";

const ROOT_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	".."
);
const MESSAGES_DIR = path.join(ROOT_DIR, "messages");

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: { isSeed: true } as const
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

	return {
		public: {
			nav: {
				destinations: convertKeysDeep(destinations ?? {}),
				routes: convertKeysDeep(routes ?? {}),
				experiences: convertKeysDeep(experiences ?? {}),
				mobileMenu: nav.mobile_menu,
				comingSoon: nav.coming_soon
			}
		}
	};
}

function buildFooterUiTexts(footer: Record<string, unknown>) {
	return {
		brand: convertKeysDeep(footer.brand ?? {}),
		comingSoon: footer.coming_soon,
		copyright: footer.copyright
	};
}

function buildUiCommon(
	common: Record<string, unknown>,
	footer: Record<string, unknown>
) {
	return {
		localeAvailability: {
			en: { enabled: true },
			ru: { enabled: true },
			uz: { enabled: true }
		},
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

function buildUiWidgets() {
	return {
		routeTimeline: {
			title: "Route timeline",
			stopLabel: "Stop {order}"
		}
	};
}

async function updateGlobalLocale(
	payload: Payload,
	slug: TUiGlobalSlug,
	locale: TLocale,
	data: Record<string, unknown>
) {
	await payload.updateGlobal({
		slug,
		data,
		locale,
		draft: false,
		...SEED_OP_OPTS
	});
}

export async function seedUiContent(payload: Payload): Promise<void> {
	console.log("Seeding UI content globals...");

	for (const locale of LOCALES) {
		const [header, footer, common, catalog, discovery, company] =
			await Promise.all([
				loadMessageFile<Record<string, unknown>>(locale, "header.json"),
				loadMessageFile<Record<string, unknown>>(locale, "footer.json"),
				loadMessageFile<Record<string, unknown>>(locale, "common.json"),
				loadMessageFile<Record<string, unknown>>(locale, "catalog_page.json"),
				loadMessageFile<Record<string, unknown>>(
					locale,
					"discovery_page.json"
				),
				loadMessageFile<Record<string, unknown>>(locale, "company_page.json")
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
			buildUiCommon(common, footer)
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
			"ui-widgets",
			locale,
			buildUiWidgets()
		);

		console.log(`  + ui content locale ${locale}`);
	}
}
