import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

import {
	CONTACT_DEFAULT_EMAIL,
	CONTACT_PHONE,
	CONTACT_WHATSAPP_HREF
} from "../model";

import { ContactDetailItem } from "./contact-detail-item";

const linkClassName =
	"text-primary font-medium underline-offset-4 hover:underline";

export async function ContactPrimarySection() {
	const t = await getTranslations("help_contact_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("primary.eyebrow")}
				title={t("primary.title")}
				description={t("primary.description")}
			/>
			<dl className="bg-card flex flex-col gap-4 rounded-xl border p-5 sm:gap-5 sm:p-6">
				<ContactDetailItem
					icon={Phone}
					label={t("primary.phone_label")}
				>
					<a
						href={`tel:${CONTACT_PHONE.e164}`}
						className={linkClassName}
					>
						{CONTACT_PHONE.display}
					</a>
				</ContactDetailItem>
				<ContactDetailItem
					icon={MessageCircle}
					label={t("primary.whatsapp_label")}
				>
					<a
						href={CONTACT_WHATSAPP_HREF}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClassName}
					>
						{CONTACT_PHONE.display}
					</a>
				</ContactDetailItem>
				<ContactDetailItem
					icon={Send}
					label={t("primary.telegram_label")}
				>
					<span>{t("primary.telegram_note")}</span>
				</ContactDetailItem>
				<ContactDetailItem icon={Mail} label={t("primary.email_label")}>
					<a
						href={`mailto:${CONTACT_DEFAULT_EMAIL}`}
						className={linkClassName}
					>
						{CONTACT_DEFAULT_EMAIL}
					</a>
				</ContactDetailItem>
			</dl>
		</section>
	);
}
