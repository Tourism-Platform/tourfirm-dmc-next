import { TourType } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import {
	ENUM_PREVIEW_TOUR_TYPES,
	type ENUM_PREVIEW_TOUR_TYPES_TYPE
} from "../types";

const MAP_PREVIEW_TOUR_TYPES: Partial<
	Record<ENUM_PREVIEW_TOUR_TYPES_TYPE, TourType>
> = {
	[ENUM_PREVIEW_TOUR_TYPES.PRIVATE]: TourType.Custom,
	[ENUM_PREVIEW_TOUR_TYPES.GROUP]: TourType.Regular
};

export const previewTourTypeMapper = createEnumMapper<
	ENUM_PREVIEW_TOUR_TYPES_TYPE,
	TourType
>(MAP_PREVIEW_TOUR_TYPES);
