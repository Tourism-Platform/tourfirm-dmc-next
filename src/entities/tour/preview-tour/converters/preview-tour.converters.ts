import { languageMapper, pickupMapper } from "../lib";
import type { IPreviewTourData, TPreviewTourBackend } from "../types";

const mapPreviewImagesToUrls = (
	images: TPreviewTourBackend["images"]
): string[] =>
	[...images]
		.sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
		.map((image) => image.image_url);

export const mapPreviewTourToFrontend = (
	backend: TPreviewTourBackend
): IPreviewTourData => ({
	// overview: backend.overview || "",
	description: backend.description || "",
	images: mapPreviewImagesToUrls(backend.images ?? []),
	cities: [],
	languages: languageMapper.fromMany(backend.languages),
	included: backend.amenities_included ?? [],
	not_included: backend.amenities_not_included ?? [],
	pickup_type: pickupMapper.fromMany(backend.pickup_type),
	pickup_description: backend.pickup_description || "",
	cancellation_policy: backend.cancellation_policy || "",
	additional_info: backend.additional_information || ""
});
