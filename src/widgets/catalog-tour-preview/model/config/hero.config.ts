import { Calendar, Globe, type LucideIcon, Users } from "lucide-react";

import {
	formatPluralCount,
	interpolateTemplate
} from "@/shared/lib/i18n/pluralize";
import type { TUiPreviewTour } from "@/shared/ui-content/ui-preview.types";

import type { IPreviewTourGeneral } from "@/entities/tour/preview-tour";

export type THeroInfoItem = {
	icon: LucideIcon;
	label: string;
};

const isAgeValue = (value?: number | ""): value is number =>
	value !== undefined && value !== "";

const formatDuration = (
	duration: IPreviewTourGeneral["duration"],
	texts: TUiPreviewTour["hero"],
	locale: string
): string => {
	const parts: string[] = [];

	if (duration.from) {
		parts.push(
			formatPluralCount(duration.from, locale, {
				one: texts.duration.daysOne,
				few: texts.duration.daysFew,
				many: texts.duration.daysMany,
				other: texts.duration.daysOther
			})
		);
	}

	if (duration.to) {
		parts.push(
			formatPluralCount(duration.to, locale, {
				one: texts.duration.nightsOne,
				few: texts.duration.nightsFew,
				many: texts.duration.nightsMany,
				other: texts.duration.nightsOther
			})
		);
	}

	return parts.join(" ");
};

const formatAgeRequires = (
	ageRequires: IPreviewTourGeneral["ageRequires"],
	texts: TUiPreviewTour["hero"]
): string => {
	const from = ageRequires.from;
	const to = ageRequires.to;
	const hasFrom = isAgeValue(from);
	const hasTo = isAgeValue(to);

	if (!hasFrom && !hasTo) {
		return texts.ageNoRestrictions;
	}

	if (hasFrom && hasTo) {
		return interpolateTemplate(texts.ageRequiresRange, { from, to });
	}

	if (hasFrom) {
		return interpolateTemplate(texts.ageRequiresFrom, { from });
	}

	return interpolateTemplate(texts.ageRequiresTo, { to: to as number });
};

export const HERO_INFO = (
	tour: IPreviewTourGeneral | undefined,
	texts: TUiPreviewTour["hero"],
	locale: string
): THeroInfoItem[] => {
	const info: THeroInfoItem[] = [];

	if (!tour) return info;

	if (tour.duration?.from || tour.duration?.to) {
		info.push({
			icon: Calendar,
			label: formatDuration(tour.duration, texts, locale)
		});
	}

	if (tour.groupSize) {
		info.push({
			icon: Users,
			label: formatPluralCount(tour.groupSize, locale, {
				one: texts.groupSize.personsOne,
				few: texts.groupSize.personsFew,
				many: texts.groupSize.personsMany,
				other: texts.groupSize.personsOther
			})
		});
	}

	info.push({
		icon: Globe,
		label: formatAgeRequires(tour.ageRequires, texts)
	});

	return info;
};
