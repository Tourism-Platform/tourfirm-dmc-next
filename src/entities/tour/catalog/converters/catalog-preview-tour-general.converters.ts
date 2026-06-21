import type {
	ICatalogPreviewTourGeneral,
	ICatalogPreviewTourGeneralBackend
} from "../types";

import { catalogPreviewTourCategoriesMapper } from "./catalog-preview-tour-categories.converters";
import { catalogPreviewTourStatusMapper } from "./catalog-preview-tour-status.converters";
import { catalogPreviewTourTypeMapper } from "./catalog-preview-tour-type.converters";

export const mapCatalogPreviewTourGeneralToFrontend = (
	backend: ICatalogPreviewTourGeneralBackend
): ICatalogPreviewTourGeneral => ({
	id: backend.id,
	status: catalogPreviewTourStatusMapper.from(backend.status)!,
	tourTitle: backend.name,
	tourType: catalogPreviewTourTypeMapper.from(backend.typ)!,
	groupSize: backend.group_size,
	duration: {
		from: backend.days,
		to: backend.nights
	},
	ageRequires: {
		from: backend.age_from ?? "",
		to: backend.age_to ?? ""
	},
	tourCategories: catalogPreviewTourCategoriesMapper.fromMany(
		backend.categories ?? []
	)
});
