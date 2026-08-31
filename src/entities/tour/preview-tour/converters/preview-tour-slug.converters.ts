import type { IResolvedTourId, TTourSlugResolutionBackend } from "../types";

import { mapPreviewOptionsListToFrontend } from "./preview-option.converters";
import { mapPreviewTourGeneralToFrontend } from "./preview-tour-general.converters";
import { mapPreviewTourToFrontend } from "./preview-tour.converters";

export const mapTourSlugToFrontend = (
	backend: TTourSlugResolutionBackend
): IResolvedTourId => ({
	tourId: backend.tour_id,
	general: mapPreviewTourGeneralToFrontend(backend.meta),
	landing: mapPreviewTourToFrontend(backend.landing),
	options: mapPreviewOptionsListToFrontend(backend.options)
});
