import { Clock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

import { CONTACT_LEGAL } from "../model";

import { ContactDetailItem } from "./contact-detail-item";

export async function ContactOfficeSection() {
	const t = await getTranslations("help_contact_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("office.eyebrow")}
				title={t("office.title")}
			/>
			<dl className="bg-card flex flex-col gap-4 rounded-xl border p-5 sm:gap-5 sm:p-6">
				<ContactDetailItem
					icon={MapPin}
					label={t("office.address_label")}
				>
					{t("office.address")}
				</ContactDetailItem>
				<ContactDetailItem icon={Clock} label={t("office.hours_label")}>
					{t("office.hours")}
				</ContactDetailItem>
				<ContactDetailItem label={t("office.timezone_label")}>
					{CONTACT_LEGAL.timezone}
				</ContactDetailItem>
			</dl>
		</section>
	);
}
