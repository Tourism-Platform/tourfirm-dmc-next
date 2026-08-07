import type { IPreviewOperator, TPreviewOperatorBackend } from "../types";

export const mapPreviewOperatorToFrontend = (
	backend: TPreviewOperatorBackend
): IPreviewOperator => ({
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
