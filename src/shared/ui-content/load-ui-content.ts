import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import { DEFAULT_UI_CATALOG } from "./ui-catalog.defaults";
import {
	mapFooterUiTexts,
	mapGlobalUiContent,
	mapHeaderUiTexts
} from "./ui-content.mapper";
import type {
	TUiBooking,
	TUiCatalog,
	TUiCommon,
	TUiContent,
	TUiDiscovery,
	TUiLogin,
	TUiOrders,
	TUiPreview,
	TUiTours
} from "./ui-content.types";
import { DEFAULT_UI_ORDERS } from "./ui-orders.defaults";
import { UI_CONTENT_CACHE_TAG } from "@/cms/cache/cache-tags";
import { auditSpan } from "@/cms/perf/audit-span";

const UI_GLOBAL_SLUGS = [
	"header",
	"footer",
	"ui-common",
	"ui-tours",
	"ui-catalog",
	"ui-orders",
	"ui-discovery",
	"ui-login",
	"ui-preview",
	"ui-preview-sheet",
	"ui-booking"
] as const;
type TUiGlobalSlug = (typeof UI_GLOBAL_SLUGS)[number];
async function fetchUiGlobalsUncached(locale: TypedLocale) {
	const payload = await auditSpan(
		"getPayload",
		{ caller: "fetchUiGlobalsUncached", locale },
		() => getPayload({ config })
	);
	const entries = await auditSpan(
		"payload.findGlobal:uiGlobals",
		{ locale, count: UI_GLOBAL_SLUGS.length },
		() =>
			Promise.all(
				UI_GLOBAL_SLUGS.map(async (slug) => {
					const doc = await payload.findGlobal({
						slug,
						locale,
						depth: 0,
						draft: false,
						fallbackLocale: "en"
					});
					return [slug, doc] as const;
				})
			)
	);
	return Object.fromEntries(entries) as unknown as Record<
		TUiGlobalSlug,
		Record<string, unknown>
	>;
}
const getCachedUiGlobals = unstable_cache(
	fetchUiGlobalsUncached,
	["ui-globals"],
	{
		tags: [UI_CONTENT_CACHE_TAG],
		revalidate: 60
	}
);
export const fetchUiGlobals = cache(async (locale: TypedLocale) => {
	const result = await getCachedUiGlobals(locale);
	return result;
});
function mapUiContentBundle(
	fallback: Record<TUiGlobalSlug, Record<string, unknown>>,
	current: Record<TUiGlobalSlug, Record<string, unknown>>
): TUiContent {
	return {
		header: mapHeaderUiTexts(fallback.header, current.header),
		footer: mapFooterUiTexts(fallback.footer, current.footer),
		common: mapGlobalUiContent(
			fallback["ui-common"],
			current["ui-common"]
		) as TUiCommon,
		tours: mapGlobalUiContent(
			fallback["ui-tours"],
			current["ui-tours"]
		) as TUiTours,
		catalog: mapGlobalUiContent(
			DEFAULT_UI_CATALOG,
			mapGlobalUiContent(
				fallback["ui-catalog"] as unknown as TUiCatalog,
				current["ui-catalog"] as unknown as TUiCatalog
			)
		) as TUiCatalog,
		orders: mapGlobalUiContent(
			DEFAULT_UI_ORDERS,
			mapGlobalUiContent(
				fallback["ui-orders"] as unknown as TUiOrders,
				current["ui-orders"] as unknown as TUiOrders
			)
		) as TUiOrders,
		discovery: mapGlobalUiContent(
			fallback["ui-discovery"],
			current["ui-discovery"]
		) as TUiDiscovery,
		login: mapGlobalUiContent(
			fallback["ui-login"],
			current["ui-login"]
		) as TUiLogin,
		preview: (() => {
			const preview = mapGlobalUiContent(
				fallback["ui-preview"],
				current["ui-preview"]
			) as TUiPreview;

			return {
				...preview,
				option: {
					...preview.option,
					sheet: mapGlobalUiContent(
						fallback["ui-preview-sheet"],
						current["ui-preview-sheet"]
					) as TUiPreview["option"]["sheet"]
				}
			};
		})(),
		booking: mapGlobalUiContent(
			fallback["ui-booking"],
			current["ui-booking"]
		) as TUiBooking
	};
}
export const loadUiContent = cache(
	async (locale: string): Promise<TUiContent> => {
		const typedLocale = locale as TypedLocale;
		const fallback = await fetchUiGlobals("en");
		const current =
			locale === "en" ? fallback : await fetchUiGlobals(typedLocale);
		const mapped = mapUiContentBundle(fallback, current);
		return mapped;
	}
);
