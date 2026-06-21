import type {
	ICatalogPreviewTourData,
	ICatalogPreviewTourLandingBackend
} from "../types";
import type { TCatalogPreviewBackendAmenity } from "../types/catalog-preview-backend.types";

import {
	catalogAmenitiesMapper,
	catalogLanguageMapper,
	catalogPickupMapper
} from "./catalog-labels.converters";

const mapPreviewImagesToUrls = (
	images: ICatalogPreviewTourLandingBackend["images"]
): string[] =>
	[...images]
		.sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
		.map((image) => image.image_url);

export const mapCatalogPreviewTourToFrontend = (
	backend: ICatalogPreviewTourLandingBackend
): ICatalogPreviewTourData => ({
	description: backend.description || "",
	images: mapPreviewImagesToUrls(backend.images ?? []),
	cities: [],
	languages: catalogLanguageMapper.fromMany(backend.languages),
	included: catalogAmenitiesMapper.fromMany(
		backend.amenities_included as TCatalogPreviewBackendAmenity[]
	),
	not_included: catalogAmenitiesMapper.fromMany(
		backend.amenities_not_included as TCatalogPreviewBackendAmenity[]
	),
	pickup_type: catalogPickupMapper.fromMany(backend.pickup_type),
	pickup_description: backend.pickup_description || "",
	cancellation_policy: backend.cancellation_policy || "",
	additional_info: backend.additional_information || ""
});
