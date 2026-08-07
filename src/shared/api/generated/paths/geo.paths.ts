import type { GeoFeature, LanguageCode } from "../Api";

// AUTO-GENERATED — не редактировать вручную
// Сгенерировано скриптом scripts/generate-api-paths.ts

export const GEO_PATHS = {
	search: {
		url: "/geo/search",
		method: "GET",
		_types: {} as {
			body: void;
			query: { q: string; lang?: LanguageCode; limit?: number };
			response: GeoFeature[];
		}
	} as const,
	reverse: {
		url: "/geo/reverse",
		method: "GET",
		_types: {} as {
			body: void;
			query: {
				lat: number;
				long: number;
				lang?: LanguageCode;
				limit?: number;
			};
			response: GeoFeature[];
		}
	} as const
} as const;
