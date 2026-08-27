import {
	CalendarMarkIcon,
	HeartPulseIcon,
	LayersIcon,
	UsersGroupRoundedIcon
} from "@solar-icons/react/outline";
import type { ReactNode } from "react";

import type { TCatalogTourCardMetaItem } from "./build-catalog-tour-card-meta";

const META_ICONS = {
	duration: CalendarMarkIcon,
	group: UsersGroupRoundedIcon,
	age: HeartPulseIcon,
	options: LayersIcon
} as const satisfies Record<
	TCatalogTourCardMetaItem["key"],
	typeof HeartPulseIcon
>;

type TMetaIconOptions = {
	size?: number;
	className?: string;
};

export function getCatalogTourCardMetaIcon(
	key: TCatalogTourCardMetaItem["key"],
	{ size = 14, className }: TMetaIconOptions = {}
): ReactNode {
	const Icon = META_ICONS[key];

	return <Icon size={size} className={className} />;
}
