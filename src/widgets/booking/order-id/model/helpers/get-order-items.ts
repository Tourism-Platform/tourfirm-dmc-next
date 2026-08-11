import type { TUiOrders } from "@/shared/ui-content";

import { type IUserOrderDetail } from "@/entities/booking";

import { type IInfoItem } from "../types";

export const getOrderItems = (
	order: IUserOrderDetail,
	fields: TUiOrders["orderInfo"]["fields"]
): IInfoItem[] => [
	{
		label: fields.tourName,
		value: order.tourName
	},
	{
		label: fields.type,
		value: order.orderType
	},
	{
		label: fields.pax,
		value: order.pax
	},
	{
		label: fields.route,
		value: order.route
	},
	{
		label: fields.duration,
		value: order.duration
	},
	{
		label: fields.dates,
		value: `${order.dates.from} - ${order.dates.to}`
	},
	{
		label: fields.comment,
		value: order.comment || "-"
	}
];
