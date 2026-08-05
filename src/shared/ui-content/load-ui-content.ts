import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import {
	mapFooterUiTexts,
	mapGlobalUiContent,
	mapHeaderUiTexts
} from "./ui-content.mapper";
import type {
	TUiCatalog,
	TUiCommon,
	TUiContent,
	TUiDiscovery,
	TUiLogin
} from "./ui-content.types";

const UI_GLOBAL_SLUGS = [
	"header",
	"footer",
	"ui-common",
	"ui-catalog",
	"ui-discovery",
	"ui-login"
] as const;

type TUiGlobalSlug = (typeof UI_GLOBAL_SLUGS)[number];

async function fetchUiGlobals(locale: TypedLocale) {
	const payload = await getPayload({ config });

	const entries = await Promise.all(
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
	);

	return Object.fromEntries(entries) as unknown as Record<
		TUiGlobalSlug,
		Record<string, unknown>
	>;
}

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
		catalog: mapGlobalUiContent(
			fallback["ui-catalog"],
			current["ui-catalog"]
		) as TUiCatalog,
		discovery: mapGlobalUiContent(
			fallback["ui-discovery"],
			current["ui-discovery"]
		) as TUiDiscovery,
		login: mapGlobalUiContent(
			fallback["ui-login"],
			current["ui-login"]
		) as TUiLogin
	};
}

export const loadUiContent = cache(
	async (locale: string): Promise<TUiContent> => {
		const typedLocale = locale as TypedLocale;
		const [fallback, current] = await Promise.all([
			fetchUiGlobals("en"),
			locale === "en" ? fetchUiGlobals("en") : fetchUiGlobals(typedLocale)
		]);

		return mapUiContentBundle(fallback, current);
	}
);
