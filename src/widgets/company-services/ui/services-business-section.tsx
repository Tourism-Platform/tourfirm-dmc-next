import { getTranslations } from "next-intl/server";

import { cn } from "@/shared/lib";

import { SERVICES_BUSINESS_CONFIG } from "../model";

import { ServicesBusinessCard } from "./services-business-card";
import { ServicesSectionHeader } from "./services-section-header";

const LAST_BUSINESS_INDEX = SERVICES_BUSINESS_CONFIG.length - 1;

export async function ServicesBusinessSection() {
	const t = await getTranslations("company_services_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12 xl:gap-16">
				<ServicesSectionHeader
					className="lg:sticky lg:top-24"
					eyebrow={t("business.eyebrow")}
					title={t("business.title")}
					description={t("business.description")}
				/>
				<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
					{SERVICES_BUSINESS_CONFIG.map((item, index) => (
						<ServicesBusinessCard
							key={item.id}
							className={cn(
								index === LAST_BUSINESS_INDEX && "sm:col-span-2"
							)}
							badge={t(item.i18n.badge)}
							title={t(item.i18n.title)}
							description={t(item.i18n.description)}
							icon={item.icon}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
