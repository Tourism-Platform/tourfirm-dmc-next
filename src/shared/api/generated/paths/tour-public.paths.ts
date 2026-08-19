import type {
	Currency,
	LandingPagePubSchema,
	LanguageCode,
	OperatorPreviewPubSchema,
	TourMetaResponse,
	TourOptionPreviewSchemaOutput,
	TourOptionPublicResponse,
	TourSchedulePubSchema
} from "../Api";

export const TOUR_PUBLIC_PATHS = {
	getTour: (tourId: string) =>
		({
			url: `/tour/${tourId}/public`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { read_lang?: LanguageCode };
				response: TourMetaResponse;
			}
		}) as const,
	listPublicTourOptions: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/option/all`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { currency?: Currency; skip?: number; limit?: number };
				response: TourOptionPreviewSchemaOutput[];
			}
		}) as const,
	getPublicTourOption: (tourId: string, optionId: string) =>
		({
			url: `/tour/${tourId}/public/option/${optionId}/itinerary`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { currency?: Currency; read_lang?: LanguageCode };
				response: TourOptionPublicResponse;
			}
		}) as const,
	getPublicLandingPage: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/landing`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { read_lang?: LanguageCode };
				response: LandingPagePubSchema;
			}
		}) as const,
	getPublicOperatorPreview: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/operator`,
			method: "GET",
			_types: {} as {
				body: void;
				query: void;
				response: OperatorPreviewPubSchema;
			}
		}) as const,
	getPublicTourSchedule: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/schedule`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { from?: string | null; to?: string | null };
				response: TourSchedulePubSchema;
			}
		}) as const
} as const;
