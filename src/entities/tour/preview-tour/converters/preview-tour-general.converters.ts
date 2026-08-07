import type {
	IPreviewTourGeneral,
	TGetPreviewTourBackendResponse
} from "../types";

import { previewTourCategoriesMapper } from "./preview-tour-categories.converters";
import { previewTourStatusMapper } from "./preview-tour-status.converters";
import { previewTourTypeMapper } from "./preview-tour-type.converters";

export const mapPreviewTourGeneralToFrontend = (
	backend: TGetPreviewTourBackendResponse
): IPreviewTourGeneral => ({
	id: backend.id,
	status: previewTourStatusMapper.from(backend.status)!,
	tourTitle: backend.name,
	tourType: previewTourTypeMapper.from(backend.typ)!,
	groupSize: backend.group_size,
	duration: {
		from: backend.days,
		to: backend.nights
	},
	ageRequires: {
		from: backend.age_from ?? "",
		to: backend.age_to ?? ""
	},
	tourCategories: previewTourCategoriesMapper.fromMany(
		backend.categories ?? []
	)
});
