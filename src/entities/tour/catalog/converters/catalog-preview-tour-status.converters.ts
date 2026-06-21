import { createEnumMapper } from "@/shared/utils";

import {
	CATALOG_PREVIEW_BACKEND_TOUR_STATUS,
	type TCatalogPreviewBackendTourStatus
} from "../types/catalog-preview-backend.types";
import {
	ENUM_CATALOG_PREVIEW_TOUR_STATUS,
	type ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE
} from "../types/catalog-preview-tour-status.types";

const MAP_TOUR_STATUS: Partial<
	Record<
		ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE,
		TCatalogPreviewBackendTourStatus
	>
> = {
	[ENUM_CATALOG_PREVIEW_TOUR_STATUS.PUBLISHED]:
		CATALOG_PREVIEW_BACKEND_TOUR_STATUS.Published,
	[ENUM_CATALOG_PREVIEW_TOUR_STATUS.ARCHIVED]:
		CATALOG_PREVIEW_BACKEND_TOUR_STATUS.Archived,
	[ENUM_CATALOG_PREVIEW_TOUR_STATUS.DRAFT]:
		CATALOG_PREVIEW_BACKEND_TOUR_STATUS.Draft
};

export const catalogPreviewTourStatusMapper = createEnumMapper<
	ENUM_CATALOG_PREVIEW_TOUR_STATUS_TYPE,
	TCatalogPreviewBackendTourStatus
>(MAP_TOUR_STATUS);
