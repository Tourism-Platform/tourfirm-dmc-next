export const TOUR_PUBLIC_PATHS = {
	getTour: (tourId: string) =>
		({
			url: `/tour/${tourId}/public`,
			method: "GET"
		}) as const,
	listPublicTourOptions: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/option/all`,
			method: "GET"
		}) as const,
	getPublicTourOption: (tourId: string, optionId: string) =>
		({
			url: `/tour/${tourId}/public/option/${optionId}`,
			method: "GET"
		}) as const,
	getPublicLandingPage: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/landing`,
			method: "GET"
		}) as const,
	getPublicOperatorPreview: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/operator`,
			method: "GET"
		}) as const,
	getPublicTourSchedule: (tourId: string) =>
		({
			url: `/tour/${tourId}/public/schedule`,
			method: "GET"
		}) as const
} as const;
