import type { THelpContactPageKeys } from "@/shared/i18n";

export type TContactEmailId = "general" | "reservation" | "mice" | "partners";

export type TContactEmailChannel = {
	id: TContactEmailId;
	email: string;
	i18n: {
		label: THelpContactPageKeys;
		description: THelpContactPageKeys;
	};
};

export type TContactLegalFieldId =
	| "legal_name"
	| "brand_name"
	| "inn"
	| "oked"
	| "tax_status"
	| "director";

export type TContactLegalField = {
	id: TContactLegalFieldId;
	i18nLabel: THelpContactPageKeys;
	valueKey?: keyof typeof import("../config/contact.config").CONTACT_LEGAL;
	i18nValue?: THelpContactPageKeys;
};
