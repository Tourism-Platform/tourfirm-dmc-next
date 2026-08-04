/**
 * Repair pass: re-seed header/footer + UI content globals on an already-seeded local DB.
 */
import path from "node:path";

import "./load-env.js";

import { getPayload, type Payload } from "payload";

import {
	mergeFooterColumnsById,
	mergeInformationAreasById,
	mergeNavItemsById
} from "@/cms/lib/merge-nav-items-by-id";
import {
	assertNoDeprecatedNavigationOrder,
	assertNoDeprecatedNavigationOrderInItems
} from "@/cms/lib/navigation-order-guard";

import {
	SUPPORTED_LOCALES,
	type TSupportedLocale
} from "../config/supported-locales.js";
import {
	CONTENT_DIR,
	ensureMedia,
	pickLocale,
	readYamlFile,
	setSeedRuntimeContext
} from "./seed.js";
import { SeedLookupCache } from "./seed-lookup-cache.js";
import { seedUiContent } from "./seed-ui-content.js";
import {
	attachSeedPoolErrorHandler,
	detectConnectionEndpoint,
	preloadMediaDbIndex,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "./seed-timing.js";

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: { isSeed: true } as const
};

type TLocale = TSupportedLocale;
type TNavContext = {
	segmentIds: Map<string, number>;
	pageIds: Map<string, number>;
	destinationSlug: string;
};

function hasLocaleContent(value: unknown, locale: TLocale): boolean {
	if (
		value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		SUPPORTED_LOCALES.some((code) => code in (value as object))
	) {
		const localized = (value as Record<string, unknown>)[locale];

		if (localized === null || localized === undefined || localized === "") {
			return false;
		}

		if (typeof localized === "object") {
			return hasLocaleContent(localized, locale);
		}

		return true;
	}

	if (Array.isArray(value)) {
		return value.some((item) => hasLocaleContent(item, locale));
	}

	if (value && typeof value === "object") {
		return Object.values(value as Record<string, unknown>).some((item) =>
			hasLocaleContent(item, locale)
		);
	}

	return false;
}

async function buildNavContext(payload: Payload): Promise<TNavContext> {
	const [segmentsResult, pagesResult, destination] = await Promise.all([
		payload.find({
			collection: "segments",
			limit: 500,
			depth: 0,
			pagination: false,
			overrideAccess: true
		}),
		payload.find({
			collection: "pages",
			limit: 1000,
			depth: 1,
			pagination: false,
			overrideAccess: true
		}),
		payload.findGlobal({
			slug: "destination",
			depth: 0,
			overrideAccess: true
		})
	]);

	const segmentIds = new Map<string, number>();

	for (const segment of segmentsResult.docs) {
		if (typeof segment.slug === "string") {
			segmentIds.set(segment.slug, segment.id as number);
		}
	}

	const pageIds = new Map<string, number>();

	for (const page of pagesResult.docs) {
		const segment =
			page.segment && typeof page.segment === "object" ? page.segment : null;
		const segmentSlug =
			segment && typeof segment.slug === "string" ? segment.slug : null;
		const pageSlug = typeof page.slug === "string" ? page.slug : null;

		if (!segmentSlug || !pageSlug) {
			continue;
		}

		const pathGroup =
			typeof page.pathGroup === "string" && page.pathGroup.length > 0
				? page.pathGroup
				: undefined;
		const key = pathGroup
			? `${segmentSlug}/${pathGroup}/${pageSlug}`
			: `${segmentSlug}/${pageSlug}`;
		pageIds.set(key, page.id as number);
	}

	const destinationSlug =
		typeof destination?.slug === "string" && destination.slug.length > 0
			? destination.slug
			: "destinations";

	return { segmentIds, pageIds, destinationSlug };
}

async function resolveNavItems(
	items: unknown[] | undefined,
	context: TNavContext
): Promise<Record<string, unknown>[]> {
	if (!items?.length) {
		return [];
	}

	assertNoDeprecatedNavigationOrderInItems(items, "navigation items");

	return Promise.all(
		items.map(async (item) => {
			if (!item || typeof item !== "object") {
				return item as Record<string, unknown>;
			}

			const entry = { ...(item as Record<string, unknown>) };
			assertNoDeprecatedNavigationOrder(entry, "navigation item");

			if (entry.type === "group" && Array.isArray(entry.groupItems)) {
				entry.groupItems = await resolveNavItems(
					entry.groupItems as unknown[],
					context
				);
			}

			if (entry.type === "page" && typeof entry.page === "string") {
				const id = context.pageIds.get(entry.page);

				if (!id) {
					throw new Error(`Page not found for nav item: ${entry.page}`);
				}

				entry.page = id;
			}

			if (
				typeof entry.href === "string" &&
				entry.href === "__DESTINATION_SLUG__"
			) {
				entry.href = `/${context.destinationSlug}`;
			}

			return entry;
		})
	);
}

async function resolveFooterColumns(
	columns: unknown[] | undefined,
	context: TNavContext
): Promise<unknown[]> {
	if (!columns?.length) {
		return [];
	}

	return Promise.all(
		columns.map(async (column) => {
			if (!column || typeof column !== "object") {
				return column;
			}

			const entry = column as Record<string, unknown>;

			return {
				...entry,
				items: await resolveNavItems(
					entry.items as unknown[] | undefined,
					context
				)
			};
		})
	);
}

async function seedNavigation(
	payload: Payload,
	context: TNavContext,
	locales: readonly TLocale[]
): Promise<void> {
	const mediaCache = new Map();
	const raw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "navigation.yml")
	);
	const headerRaw = raw.header as Record<string, unknown> | undefined;
	const footerRaw = raw.footer as Record<string, unknown> | undefined;
	const primary = locales.includes("en") ? "en" : (locales[0] ?? "en");

	if (headerRaw) {
		console.log("Seeding header...");
		const primaryLocalized = pickLocale(headerRaw, primary) as Record<
			string,
			unknown
		>;
		const primaryNavItems = await resolveNavItems(
			primaryLocalized.navItems as unknown[] | undefined,
			context
		);
		const primaryData: Record<string, unknown> = {
			...primaryLocalized,
			navItems: primaryNavItems
		};

		if (typeof primaryData.logo === "string") {
			primaryData.logo = (
				await ensureMedia(payload, mediaCache, primaryData.logo)
			).id;
		}

		await payload.updateGlobal({
			slug: "header",
			data: primaryData,
			locale: primary,
			...SEED_OP_OPTS
		});

		const headerWithIds = await payload.findGlobal({
			slug: "header",
			locale: primary,
			depth: 0,
			...SEED_OP_OPTS
		});

		for (const locale of locales) {
			if (locale === primary || !hasLocaleContent(headerRaw, locale)) {
				continue;
			}

			const localized = pickLocale(headerRaw, locale) as Record<
				string,
				unknown
			>;
			const navItems = await resolveNavItems(
				localized.navItems as unknown[] | undefined,
				context
			);

			await payload.updateGlobal({
				slug: "header",
				data: {
					navItems: mergeNavItemsById(
						headerWithIds?.navItems as Record<string, unknown>[] | undefined,
						navItems
					),
					informationAreas: mergeInformationAreasById(
						headerWithIds?.informationAreas as
							| Record<string, unknown>[]
							| undefined,
						(localized.informationAreas as Record<string, unknown>[]) ?? []
					),
					ctaAction: localized.ctaAction
				},
				locale,
				...SEED_OP_OPTS
			});
			console.log(`  + header ${locale}`);
		}

		console.log(`  + header ${primary}`);
	}

	if (footerRaw) {
		console.log("Seeding footer...");
		const primaryLocalized = pickLocale(footerRaw, primary) as Record<
			string,
			unknown
		>;
		const primaryColumns = await resolveFooterColumns(
			primaryLocalized.columns as unknown[] | undefined,
			context
		);

		await payload.updateGlobal({
			slug: "footer",
			data: {
				...primaryLocalized,
				columns: primaryColumns
			},
			locale: primary,
			...SEED_OP_OPTS
		});

		const footerWithIds = await payload.findGlobal({
			slug: "footer",
			locale: primary,
			depth: 0,
			...SEED_OP_OPTS
		});

		for (const locale of locales) {
			if (locale === primary || !hasLocaleContent(footerRaw, locale)) {
				continue;
			}

			const localized = pickLocale(footerRaw, locale) as Record<
				string,
				unknown
			>;
			const columns = await resolveFooterColumns(
				localized.columns as unknown[] | undefined,
				context
			);

			await payload.updateGlobal({
				slug: "footer",
				data: {
					columns: mergeFooterColumnsById(
						footerWithIds?.columns as Record<string, unknown>[] | undefined,
						columns as Record<string, unknown>[]
					),
					copyrightText: localized.copyrightText
				},
				locale,
				...SEED_OP_OPTS
			});
			console.log(`  + footer ${locale}`);
		}

		console.log(`  + footer ${primary}`);
	}
}

async function main(): Promise<void> {
	const uri = resolveSeedDatabaseUri();

	if (detectConnectionEndpoint(uri) !== "local") {
		throw new Error("Repair script only allows localhost DB");
	}

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = uri;

	await wakeDatabase(uri);
	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(new SeedLookupCache(), mediaDbIndex);

	const context = await buildNavContext(payload);
	await seedNavigation(payload, context, SUPPORTED_LOCALES);
	await seedUiContent(payload);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Navigation + UI repair complete");
}

main().catch((error) => {
	console.error("Repair failed:", error);
	process.exit(1);
});
