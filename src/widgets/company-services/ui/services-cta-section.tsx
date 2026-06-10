import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomCtaBanner } from "@/shared/ui";

import { SERVICES_CTA_IMAGE } from "../model";

export async function ServicesCtaSection() {
	const t = await getTranslations("company_services_page");

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
			imageSrc={SERVICES_CTA_IMAGE}
			actions={
				<>
					<Button asChild>
						<Link href={ENUM_PATH.HELP.CONTACT}>
							{t("cta.primary")}
						</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href={ENUM_PATH.MAIN.CATALOG}>
							{t("cta.secondary")}
						</Link>
					</Button>
				</>
			}
		/>
	);
}
