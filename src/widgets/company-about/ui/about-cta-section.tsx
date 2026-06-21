import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomCtaBanner } from "@/shared/ui";

import { ContactMailtoButton } from "@/features/contact-mailto";

import { ABOUT_CTA_IMAGE } from "../model";

export async function AboutCtaSection() {
	const t = await getTranslations("company_about_page");

	return (
		<CustomCtaBanner
			eyebrow={t("cta.eyebrow")}
			title={t("cta.title")}
			description={t("cta.description")}
			imageSrc={ABOUT_CTA_IMAGE}
			actions={
				<>
					<Button asChild>
						<Link href={ENUM_PATH.MAIN.CATALOG.ROOT}>
							{t("cta.primary")}
						</Link>
					</Button>
					<ContactMailtoButton variant="outline">
						{t("cta.secondary")}
					</ContactMailtoButton>
				</>
			}
		/>
	);
}
