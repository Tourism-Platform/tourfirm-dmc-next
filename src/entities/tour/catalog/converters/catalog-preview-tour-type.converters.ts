import { createEnumMapper } from "@/shared/utils";

import {
	CATALOG_PREVIEW_BACKEND_TOUR_TYPE,
	type TCatalogPreviewBackendTourType
} from "../types/catalog-preview-backend.types";
import {
	ENUM_CATALOG_PREVIEW_TOUR_TYPES,
	type ENUM_CATALOG_PREVIEW_TOUR_TYPES_TYPE
} from "../types/catalog-preview-tour-type.types";

const MAP_TOUR_TYPES: Partial<
	Record<ENUM_CATALOG_PREVIEW_TOUR_TYPES_TYPE, TCatalogPreviewBackendTourType>
> = {
	[ENUM_CATALOG_PREVIEW_TOUR_TYPES.PRIVATE]:
		CATALOG_PREVIEW_BACKEND_TOUR_TYPE.Custom,
	[ENUM_CATALOG_PREVIEW_TOUR_TYPES.GROUP]:
		CATALOG_PREVIEW_BACKEND_TOUR_TYPE.Regular
};

export const catalogPreviewTourTypeMapper = createEnumMapper<
	ENUM_CATALOG_PREVIEW_TOUR_TYPES_TYPE,
	TCatalogPreviewBackendTourType
>(MAP_TOUR_TYPES);
