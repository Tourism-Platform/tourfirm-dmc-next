import type {
	ICatalogPreviewOperator,
	ICatalogPreviewOperatorBackend
} from "../types";

export const mapCatalogPreviewOperatorToFrontend = (
	backend: ICatalogPreviewOperatorBackend
): ICatalogPreviewOperator => ({
	id: backend.id,
	business_name: backend.business_name || "",
	description: backend.description || "",
	website_url: backend.website_url || "",
	email: backend.contact_email || "",
	phone: backend.contact_phone || "",
	address: backend.address_line || "",
	city: backend.city || "",
	country: backend.country || "",
	logo: backend.logo_url || ""
});
