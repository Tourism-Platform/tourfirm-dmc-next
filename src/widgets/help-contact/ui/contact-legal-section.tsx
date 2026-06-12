import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

import { CONTACT_LEGAL, CONTACT_LEGAL_FIELDS } from "../model";

import { ContactDetailItem } from "./contact-detail-item";

export async function ContactLegalSection() {
	const t = await getTranslations("help_contact_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("legal.eyebrow")}
				title={t("legal.title")}
			/>
			<dl className="bg-card flex flex-col gap-4 rounded-xl border p-5 sm:gap-5 sm:p-6">
				{CONTACT_LEGAL_FIELDS.map((field) => {
					const value = field.i18nValue
						? t(field.i18nValue)
						: field.valueKey
							? CONTACT_LEGAL[field.valueKey]
							: "";

					return (
						<ContactDetailItem
							key={field.id}
							label={t(field.i18nLabel)}
						>
							{value}
						</ContactDetailItem>
					);
				})}
			</dl>
		</section>
	);
}
