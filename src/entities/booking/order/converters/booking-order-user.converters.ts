import { formatDate } from "@/shared/utils";

import type {
	IOrderOperatorInfo,
	IOrderTourInfo,
	IUserOrderDetail,
	TUserOrderDetailBackend
} from "../types";

import { bookingTourTypeMapper } from "./booking-tour-type.convert";
import { orderStatusMapper } from "./order-status.convert";

const formatTourDuration = (days: number, nights: number): string =>
	`${days} days / ${nights} nights`;

const mapOrderTourInfo = (
	tour: TUserOrderDetailBackend["tour"]
): IOrderTourInfo => {
	const orderType = bookingTourTypeMapper.from(tour.typ)!;
	const tourName = tour.title ?? "";

	return {
		name: tourName,
		type: orderType,
		days: tour.days,
		nights: tour.nights,
		route: tour.route?.join(" - ") ?? "-",
		duration: formatTourDuration(tour.days, tour.nights)
	};
};

const mapOrderOperatorInfo = (
	operator: TUserOrderDetailBackend["operator"]
): IOrderOperatorInfo => ({
	id: operator.id,
	name: operator.name,
	businessName: operator.business_name ?? null,
	contactPerson: operator.contact_person ?? null,
	contactPosition: operator.contact_position ?? null,
	contactEmail: operator.contact_email ?? null,
	contactPhone: operator.contact_phone ?? null,
	websiteUrl: operator.website_url ?? null,
	logoUrl: operator.logo_url ?? null
});

export const mapUserBookingOrderToFrontend = (
	data: TUserOrderDetailBackend
): IUserOrderDetail => {
	const { order, tour: tourRaw, operator } = data;
	const tour = mapOrderTourInfo(tourRaw);

	return {
		orderId: order.id,
		orderNumber: order.order_number,
		orderType: tour.type,
		status: orderStatusMapper.from(order.status)!,
		pax: order.pax,
		dates: {
			from: formatDate(order.date),
			to: formatDate(order.end_date)
		},
		tourName: tour.name,
		tourOptionId: order.tour_option_id,
		tour,
		duration: tour.duration,
		route: tour.route,
		comment: order.comment ?? undefined,
		tourAmount: order.tour_amount,
		paidAmount: order.paid_amount,
		operator: mapOrderOperatorInfo(operator)
	};
};
