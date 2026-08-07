import type { TEnumLanguagesType, TEnumPickupTypeType } from "../lib";

export interface IPreviewTourData {
	description: string;
	images: string[];
	cities: string[];
	languages: TEnumLanguagesType[];
	included: string[];
	not_included: string[];
	pickup_type: TEnumPickupTypeType[];
	pickup_description: string;
	cancellation_policy: string;
	additional_info: string;
}
