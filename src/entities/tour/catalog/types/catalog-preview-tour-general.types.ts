import type { ENUM_CATALOG_PREVIEW_TOUR_CATEGORY_TYPE } from "./catalog-preview-tour-category.types";
import type { ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE } from "./catalog-preview-tour-status.types";
import type { ENUM_CATALOG_PREVIEW_TOUR_TYPES_TYPE } from "./catalog-preview-tour-type.types";

export interface ICatalogPreviewTourGeneral {
	id: string;
	status: ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE;
	tourTitle: string;
	tourType: ENUM_CATALOG_PREVIEW_TOUR_TYPES_TYPE;
	groupSize: number;
	duration: {
		from: number;
		to: number;
	};
	ageRequires: {
		from?: number | "";
		to?: number | "";
	};
	tourCategories: ENUM_CATALOG_PREVIEW_TOUR_CATEGORY_TYPE[];
}
