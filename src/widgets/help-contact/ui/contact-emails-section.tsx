import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader, DestinationInsightCard } from "@/shared/ui";

import { CONTACT_EMAIL_CHANNELS } from "../model";

export async function ContactEmailsSection() {
	const t = await getTranslations("help_contact_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("emails.eyebrow")}
				title={t("emails.title")}
				description={t("emails.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{CONTACT_EMAIL_CHANNELS.map((channel) => (
					<div key={channel.id} className="flex flex-col gap-3">
						<DestinationInsightCard
							data={{
								icon: Mail,
								title: t(channel.i18n.label),
								description: t(channel.i18n.description)
							}}
						/>
						<a
							href={`mailto:${channel.email}`}
							className="text-primary px-5 text-sm font-medium underline-offset-4 hover:underline sm:px-6 sm:text-base"
						>
							{channel.email}
						</a>
					</div>
				))}
			</div>
		</section>
	);
}
