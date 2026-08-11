"use client";

import {
	BedDouble,
	Bus,
	Calendar,
	Info,
	Layers,
	LucideIcon,
	Package,
	Plane,
	Ticket
} from "lucide-react";

import {
	ENUM_PREVIEW_OPTION_EVENT,
	type TPreviewOptionEventType
} from "@/entities/tour/preview-tour";

export const EVENT_METADATA: Partial<
	Record<TPreviewOptionEventType, { icon: LucideIcon; color_bg: string }>
> = {
	[ENUM_PREVIEW_OPTION_EVENT.FLIGHT]: {
		icon: Plane,
		color_bg: "bg-blue-500"
	},
	[ENUM_PREVIEW_OPTION_EVENT.ACTIVITY]: {
		icon: Ticket,
		color_bg: "bg-sky-500"
	},
	[ENUM_PREVIEW_OPTION_EVENT.ACCOMMODATION]: {
		icon: BedDouble,
		color_bg: "bg-cyan-700"
	},
	[ENUM_PREVIEW_OPTION_EVENT.TRANSPORTATION]: {
		icon: Bus,
		color_bg: "bg-emerald-600"
	},
	[ENUM_PREVIEW_OPTION_EVENT.SUPPLEMENT]: {
		icon: Package,
		color_bg: "bg-violet-600"
	},
	[ENUM_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION]: {
		icon: Layers,
		color_bg: "bg-zinc-700"
	},
	[ENUM_PREVIEW_OPTION_EVENT.INFO]: {
		icon: Info,
		color_bg: "bg-amber-600"
	}
};

export const FALLBACK_EVENT_ICON = Calendar;
