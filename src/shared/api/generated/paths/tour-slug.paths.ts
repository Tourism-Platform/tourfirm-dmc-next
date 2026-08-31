import type {
	Currency,
	LanguageCode,
	SitemapEntrySchema,
	TourSlugResolutionSchema
} from "../Api";

// AUTO-GENERATED — не редактировать вручную
// Сгенерировано скриптом scripts/generate-api-paths.ts

export const TOUR_SLUG_PATHS = {
	listSitemap: {
		url: "/tour/slug/sitemap",
		method: "GET",
		_types: {} as {
			body: void;
			query: { skip?: number; limit?: number };
			response: SitemapEntrySchema[];
		}
	} as const,
	resolveTourSlug: (slug: string) =>
		({
			url: `/tour/slug/${slug}`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { read_lang?: LanguageCode; currency?: Currency };
				response: TourSlugResolutionSchema;
			}
		}) as const
} as const;
