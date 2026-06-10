import { Briefcase, Heart, type LucideIcon, User, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/shared/ui";

import { DestinationInsightCard } from "@/entities/tour";

import { MAIN_TRIP_FORMATS_CONFIG, type TTripFormatId } from "../model";

import { MainSectionHeader } from "./main-section-header";

const FORMAT_ICONS: Record<TTripFormatId, LucideIcon> = {
	private: User,
	group: Users,
	family: Heart,
	mice: Briefcase
};

export async function TripFormatsSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<MainSectionHeader
				eyebrow={t("trip_formats.eyebrow")}
				title={t("trip_formats.title")}
				description={t("trip_formats.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{MAIN_TRIP_FORMATS_CONFIG.map((item) => (
					<div key={item.id} className="flex flex-col gap-3">
						<Badge variant="secondary" className="w-fit">
							{t(item.i18n.badge)}
						</Badge>
						<DestinationInsightCard
							data={{
								icon: FORMAT_ICONS[item.id],
								title: t(item.i18n.title),
								description: t(item.i18n.description)
							}}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
