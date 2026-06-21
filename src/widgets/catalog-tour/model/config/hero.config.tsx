import { Calendar, Globe, type LucideIcon, Users } from "lucide-react";
import type { useTranslations } from "next-intl";

import type { ICatalogPreviewTourGeneral } from "@/entities/tour/catalog";

export type TCatalogTourPageTranslate = ReturnType<
	typeof useTranslations<"catalog_tour_page">
>;

export interface IHeroInfo {
	icon: LucideIcon;
	label: string;
}

const isAgeValue = (value?: number | ""): value is number =>
	value !== undefined && value !== "";

const formatDuration = (
	duration: ICatalogPreviewTourGeneral["duration"],
	t: TCatalogTourPageTranslate
): string => {
	const parts: string[] = [];

	if (duration.from) {
		parts.push(
			t("hero.duration.days", {
				count: duration.from
			})
		);
	}

	if (duration.to) {
		parts.push(
			t("hero.duration.nights", {
				count: duration.to
			})
		);
	}

	return parts.join(" ");
};

const formatAgeRequires = (
	ageRequires: ICatalogPreviewTourGeneral["ageRequires"],
	t: TCatalogTourPageTranslate
): string => {
	const from = ageRequires.from;
	const to = ageRequires.to;
	const hasFrom = isAgeValue(from);
	const hasTo = isAgeValue(to);

	if (!hasFrom && !hasTo) {
		return t("hero.age_no_restrictions");
	}

	if (hasFrom && hasTo) {
		return t("hero.age_requires_range", { from, to });
	}

	if (hasFrom) {
		return t("hero.age_requires_from", { from });
	}

	return t("hero.age_requires_to", { to: to as number });
};

export const HERO_INFO = (
	tour: ICatalogPreviewTourGeneral | undefined,
	t: TCatalogTourPageTranslate
): IHeroInfo[] => {
	const info: IHeroInfo[] = [];

	if (!tour) return info;

	if (tour.duration?.from || tour.duration?.to) {
		info.push({
			icon: Calendar,
			label: formatDuration(tour.duration, t)
		});
	}

	if (tour.groupSize) {
		info.push({
			icon: Users,
			label: t("hero.group_size.persons", { count: tour.groupSize })
		});
	}

	info.push({
		icon: Globe,
		label: formatAgeRequires(tour.ageRequires, t)
	});

	return info;
};
