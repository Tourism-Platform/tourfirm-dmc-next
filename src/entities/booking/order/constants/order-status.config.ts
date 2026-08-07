import type { BadgeVariant } from "@/shared/ui";

import { ENUM_ORDER_STATUS, type ENUM_ORDER_STATUS_TYPE } from "../types";

export const BOOKING_ORDER_STATUS_LABELS: Record<
	ENUM_ORDER_STATUS_TYPE,
	string
> = {
	[ENUM_ORDER_STATUS.NEW]: "booking.order.statuses.new",
	[ENUM_ORDER_STATUS.IN_PROCESSING]: "booking.order.statuses.in_processing",
	[ENUM_ORDER_STATUS.BOOKING]: "booking.order.statuses.booking",
	[ENUM_ORDER_STATUS.IN_PROGRESS]: "booking.order.statuses.in_progress",
	[ENUM_ORDER_STATUS.COMPLETED]: "booking.order.statuses.completed",
	[ENUM_ORDER_STATUS.CANCELLED]: "booking.order.statuses.cancelled"
};

export const BOOKING_ORDER_STATUS_VARIANTS: Record<
	ENUM_ORDER_STATUS_TYPE,
	BadgeVariant
> = {
	[ENUM_ORDER_STATUS.NEW]: "blue",
	[ENUM_ORDER_STATUS.IN_PROCESSING]: "yellow",
	[ENUM_ORDER_STATUS.BOOKING]: "orange",
	[ENUM_ORDER_STATUS.IN_PROGRESS]: "cyan",
	[ENUM_ORDER_STATUS.COMPLETED]: "green",
	[ENUM_ORDER_STATUS.CANCELLED]: "red"
};
