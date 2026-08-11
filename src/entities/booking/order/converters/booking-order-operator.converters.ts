import { formatDate } from "@/shared/utils";

import type {
	IOrderOperatorInfo,
	IOrderTourInfo,
	IUserOrderDetail,
	TOperatorOrderDetailBackend
} from "../types";

import { bookingTourTypeMapper } from "./booking-tour-type.convert";
import { orderStatusMapper } from "./order-status.convert";

const formatTourDuration = (days: number, nights: number): string =>
	`${days} days / ${nights} nights`;

const mapOrderTourInfo = (
	tour: TOperatorOrderDetailBackend["tour"]
): IOrderTourInfo => {
	const orderType = bookingTourTypeMapper.from(tour.typ)!;

	return {
		name: tour.title ?? "",
		type: orderType,
		days: tour.days,
		nights: tour.nights,
		route: tour.route?.join(" - ") ?? "-",
		duration: formatTourDuration(tour.days, tour.nights)
	};
};

/** Maps agency/user client into contact shape used by existing OrderInfoCard. */
const mapClientContact = (
	data: TOperatorOrderDetailBackend
): IOrderOperatorInfo => {
	const { agency, user } = data;

	if (agency) {
		return {
			id: agency.id,
			name: agency.name,
			businessName: agency.business_name ?? null,
			contactPerson: agency.contact_person ?? null,
			contactPosition: agency.contact_position ?? null,
			contactEmail: agency.contact_email ?? null,
			contactPhone: agency.contact_phone ?? null,
			websiteUrl: null,
			logoUrl: null
		};
	}

	if (user) {
		const fullName = [user.first_name, user.last_name]
			.map((part) => part?.trim())
			.filter(Boolean)
			.join(" ");

		return {
			id: user.id,
			name: fullName || user.email,
			businessName: null,
			contactPerson: fullName || user.email,
			contactPosition: null,
			contactEmail: user.email,
			contactPhone: user.phone_number ?? null,
			websiteUrl: null,
			logoUrl: null
		};
	}

	return {
		id: "",
		name: "-",
		businessName: null,
		contactPerson: null,
		contactPosition: null,
		contactEmail: null,
		contactPhone: null,
		websiteUrl: null,
		logoUrl: null
	};
};

export const mapOperatorBookingOrderToUserDetail = (
	data: TOperatorOrderDetailBackend
): IUserOrderDetail => {
	const { order, tour: tourRaw } = data;
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
		operator: mapClientContact(data)
	};
};
