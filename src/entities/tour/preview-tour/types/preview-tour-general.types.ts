import type { ENUM_PREVIEW_TOUR_CATEGORY_TYPE } from "./preview-tour-category.types";
import type { ENUM_PREVIEW_TOUR_STATUS_TYPE } from "./preview-tour-status.types";
import type { ENUM_PREVIEW_TOUR_TYPES_TYPE } from "./preview-tour-type.types";

export interface IPreviewTourGeneral {
	id: string;
	status: ENUM_PREVIEW_TOUR_STATUS_TYPE;
	tourTitle: string;
	tourType: ENUM_PREVIEW_TOUR_TYPES_TYPE;
	groupSize: number;
	duration: {
		from: number;
		to: number;
	};
	ageRequires: {
		from?: number | "";
		to?: number | "";
	};
	tourCategories: ENUM_PREVIEW_TOUR_CATEGORY_TYPE[];
}
