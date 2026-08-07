import { TourStatus } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import {
	ENUM_PREVIEW_TOUR_STATUS,
	type ENUM_PREVIEW_TOUR_STATUS_TYPE
} from "../types";

const MAP_PREVIEW_TOUR_STATUS: Partial<
	Record<ENUM_PREVIEW_TOUR_STATUS_TYPE, TourStatus>
> = {
	[ENUM_PREVIEW_TOUR_STATUS.PUBLISHED]: TourStatus.Published,
	[ENUM_PREVIEW_TOUR_STATUS.ARCHIVED]: TourStatus.Archived,
	[ENUM_PREVIEW_TOUR_STATUS.DRAFT]: TourStatus.Draft
};

export const previewTourStatusMapper = createEnumMapper<
	ENUM_PREVIEW_TOUR_STATUS_TYPE,
	TourStatus
>(MAP_PREVIEW_TOUR_STATUS);
