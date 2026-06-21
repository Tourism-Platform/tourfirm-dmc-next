import { getTranslations } from "next-intl/server";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomCtaBanner } from "@/shared/ui";

import { ContactMailtoButton } from "@/features/contact-mailto";

import { DESTINATIONS_CTA_IMAGE } from "../model";

export async function DestinationsCta() {
	const t = await getTranslations("destinations_page");

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
			imageSrc={DESTINATIONS_CTA_IMAGE}
			actions={
				<>
					<ContactMailtoButton>
						{t("cta.primary")}
					</ContactMailtoButton>
					<Button asChild variant="outline">
						<Link
							href={buildRouteWithQuery(ENUM_PATH.MAIN.SEARCH, {
								destination: "Uzbekistan"
							})}
						>
							{t("cta.secondary")}
						</Link>
					</Button>
				</>
			}
		/>
	);
}
