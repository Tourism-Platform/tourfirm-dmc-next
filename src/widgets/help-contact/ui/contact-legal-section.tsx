import { getTranslations } from "next-intl/server";

import {
	ContactDetailItem,
	ContactDetailPanel,
	CustomSectionHeader
} from "@/shared/ui";

import { CONTACT_LEGAL, CONTACT_LEGAL_FIELDS } from "../model";

export async function ContactLegalSection() {
	const t = await getTranslations("help_contact_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("legal.eyebrow")}
				title={t("legal.title")}
			/>
			<ContactDetailPanel>
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
			</ContactDetailPanel>
		</section>
	);
}
