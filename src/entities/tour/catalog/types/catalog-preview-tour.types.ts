import type {
	ENUM_CATALOG_AMENITIES_TYPE,
	ENUM_CATALOG_LANGUAGES_TYPE,
	ENUM_CATALOG_PICKUP_TYPE_TYPE
} from "./catalog-labels.types";

export interface ICatalogPreviewTourData {
	description: string;
	images: string[];
	cities: string[];
	languages: ENUM_CATALOG_LANGUAGES_TYPE[];
	included: ENUM_CATALOG_AMENITIES_TYPE[];
	not_included: ENUM_CATALOG_AMENITIES_TYPE[];
	pickup_type: ENUM_CATALOG_PICKUP_TYPE_TYPE[];
	pickup_description: string;
	cancellation_policy: string;
	additional_info: string;
}
