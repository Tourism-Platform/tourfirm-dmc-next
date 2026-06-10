import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Badge } from "@/shared/ui";

import { SERVICES_HERO_IMAGE } from "../model";

import { ServicesSectionHeader } from "./services-section-header";

export async function ServicesPhilosophySection() {
	const t = await getTranslations("company_services_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<div className="flex flex-col gap-4">
					<ServicesSectionHeader
						eyebrow={t("philosophy.eyebrow")}
						title={t("philosophy.title")}
					/>
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">
							{t("philosophy.label_logic")}
						</Badge>
						<Badge variant="outline">
							{t("philosophy.label_route")}
						</Badge>
					</div>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("philosophy.paragraph_1")}
					</p>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("philosophy.paragraph_2")}
					</p>
				</div>
				<div className="relative min-h-64 overflow-hidden rounded-2xl lg:min-h-80">
					<Image
						src={SERVICES_HERO_IMAGE}
						alt={t("philosophy.title")}
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>
		</section>
	);
}
