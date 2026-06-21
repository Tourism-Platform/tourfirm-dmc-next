export const ENUM_CATALOG_PREVIEW_TOUR_STATUS = {
	ALL: "all",
	PUBLISHED: "published",
	ARCHIVED: "archived",
	DRAFT: "draft"
} as const;

export type ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE =
	(typeof ENUM_CATALOG_PREVIEW_TOUR_STATUS)[keyof typeof ENUM_CATALOG_PREVIEW_TOUR_STATUS];
