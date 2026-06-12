import type { TContactEmailChannel, TContactLegalField } from "../types";

export const CONTACT_EMAIL_CHANNELS: TContactEmailChannel[] = [
	{
		id: "general",
		email: "info@tourlink.uz",
		i18n: {
			label: "emails.items.general.label",
			description: "emails.items.general.description"
		}
	},
	{
		id: "reservation",
		email: "reservation@tourlink.uz",
		i18n: {
			label: "emails.items.reservation.label",
			description: "emails.items.reservation.description"
		}
	},
	{
		id: "mice",
		email: "mice@tourlink.uz",
		i18n: {
			label: "emails.items.mice.label",
			description: "emails.items.mice.description"
		}
	},
	{
		id: "partners",
		email: "partners@tourlink.uz",
		i18n: {
			label: "emails.items.partners.label",
			description: "emails.items.partners.description"
		}
	}
];

export const CONTACT_LEGAL_FIELDS: TContactLegalField[] = [
	{
		id: "legal_name",
		i18nLabel: "legal.fields.legal_name",
		valueKey: "legalName"
	},
	{
		id: "brand_name",
		i18nLabel: "legal.fields.brand_name",
		valueKey: "brandName"
	},
	{
		id: "inn",
		i18nLabel: "legal.fields.inn",
		valueKey: "inn"
	},
	{
		id: "oked",
		i18nLabel: "legal.fields.oked",
		valueKey: "oked"
	},
	{
		id: "tax_status",
		i18nLabel: "legal.fields.tax_status",
		i18nValue: "legal.values.tax_status"
	},
	{
		id: "director",
		i18nLabel: "legal.fields.director",
		valueKey: "director"
	}
];
