import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomCtaBanner } from "@/shared/ui";

import { ContactMailtoButton } from "@/features/contact-mailto";

import { MAIN_CTA_IMAGE } from "../model";

export async function MainCta() {
	const t = await getTranslations("main_page");

	return (
		<CustomCtaBanner
			eyebrow={t("cta.eyebrow")}
			title={
				<>
					{t("cta.title")}{" "}
					<span className="text-primary italic">
						{t("cta.title_accent")}
					</span>{" "}
					{t("cta.title_suffix")}
				</>
			}
			description={t("cta.description")}
			imageSrc={MAIN_CTA_IMAGE}
			actions={
				<>
					<ContactMailtoButton>
						{t("cta.primary")}
					</ContactMailtoButton>
					<Button asChild variant="outline">
						<Link href={ENUM_PATH.MAIN.DESTINATIONS}>
							{t("cta.secondary")}
						</Link>
					</Button>
				</>
			}
		/>
	);
}
