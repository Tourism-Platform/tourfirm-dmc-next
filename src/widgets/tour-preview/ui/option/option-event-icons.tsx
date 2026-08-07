"use client";

import { Bed, Bus, Info, List, Map, MoreHorizontal, Plane } from "lucide-react";

import {
	ENUM_PREVIEW_OPTION_EVENT,
	type TPreviewOptionEventType
} from "@/entities/tour/preview-tour";

const ICON_CLASS = "text-primary";

export const getOptionEventIcon = (
	type: TPreviewOptionEventType,
	size: "sm" | "lg" = "sm"
) => {
	const className =
		size === "lg" ? `w-8 h-8 ${ICON_CLASS}` : `w-5 h-5 ${ICON_CLASS}`;

	switch (type) {
		case ENUM_PREVIEW_OPTION_EVENT.ACCOMMODATION:
			return <Bed className={className} />;
		case ENUM_PREVIEW_OPTION_EVENT.FLIGHT:
			return <Plane className={className} />;
		case ENUM_PREVIEW_OPTION_EVENT.ACTIVITY:
			return <Map className={className} />;
		case ENUM_PREVIEW_OPTION_EVENT.TRANSPORTATION:
			return <Bus className={className} />;
		case ENUM_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION:
			return <MoreHorizontal className={className} />;
		case ENUM_PREVIEW_OPTION_EVENT.INFO:
			return <Info className={className} />;
		default:
			return <List className={className} />;
	}
};
