import type { BookingOrderDetail } from "@/shared/api";
import { formatDate } from "@/shared/utils";

import {
	ENUM_CLIENT_TYPE_OPTIONS,
	type IBookingOrderFilters,
	type IOrder,
	type IOrderAgencyInfo,
	type IOrderDetail,
	type IOrderTourInfo,
	type IOrderUserInfo,
	type TBookingOrderBackend,
	type TBookingOrderBackendResponse,
	type TBookingOrderDetailBackend,
	type TBookingOrderListItemBackend,
	type TBookingOrderPaginatedQuery,
	type TBookingOrderPaginatedResponse
} from "../types";

import { bookingClientTypeMapper } from "./booking-client-type.convert";
import { bookingTourTypeMapper } from "./booking-tour-type.convert";
import { orderStatusMapper } from "./order-status.convert";

const formatTourDuration = (days: number, nights: number): string =>
	`${days} days / ${nights} nights`;

const mapOrderAgencyInfo = (
	agency: BookingOrderDetail["agency"]
): IOrderAgencyInfo => ({
	id: agency?.id ?? "",
	name: agency?.name ?? "",
	businessName: agency?.business_name ?? "",
	contactPerson: agency?.contact_person ?? "",
	contactEmail: agency?.contact_email ?? "",
	contactPhone: agency?.contact_phone ?? ""
});

const mapOrderUserInfo = (
	user: BookingOrderDetail["user"]
): IOrderUserInfo | null => {
	if (!user) return null;

	return {
		id: user.id,
		email: user.email,
		firstName: user.first_name ?? "",
		lastName: user.last_name ?? "",
		phoneNumber: user.phone_number ?? ""
	};
};

const mapOrderTourInfo = (tour: BookingOrderDetail["tour"]): IOrderTourInfo => {
	const orderType = bookingTourTypeMapper.from(tour.typ)!;

	return {
		name: tour.name,
		type: orderType,
		days: tour.days,
		nights: tour.nights,
		route: tour.route?.join(" - ") ?? "-",
		duration: formatTourDuration(tour.days, tour.nights)
	};
};

export const mapBookingOrderListItemToFrontend = (
	data: TBookingOrderListItemBackend
): IOrder => ({
	orderId: data.id,
	orderNumber: data.order_number,
	orderType: bookingTourTypeMapper.from(data.tour_type)!,
	dateCreated: formatDate(data.created_at),
	client: data.client_name,
	clientType: bookingClientTypeMapper.from(data.client_type)!,
	pax: data.pax,
	dates: {
		from: formatDate(data.date),
		to: formatDate(data.end_date)
	},
	tourName: data.tour_name,
	status: orderStatusMapper.from(data.status)!
});

export const mapBookingOrderToFrontend = (data: TBookingOrderBackend) =>
	mapBookingOrderListItemToFrontend(
		data as unknown as TBookingOrderListItemBackend
	);

export const mapBookingOrderDetailToFrontend = (
	data: TBookingOrderDetailBackend
): IOrderDetail => {
	const tour = mapOrderTourInfo(data.tour);

	return {
		orderId: data.id,
		orderNumber: data.order_number || data.id,
		orderType: tour.type,
		dateCreated: "",
		client: "",
		clientType: ENUM_CLIENT_TYPE_OPTIONS.AGENCY,
		pax: data.pax,
		dates: {
			from: formatDate(data.date),
			to: formatDate(data.end_date)
		},
		tourName: tour.name,
		status: orderStatusMapper.from(data.status)!,
		agencyId: data.agency_id ?? "",
		agency: mapOrderAgencyInfo(data.agency),
		userId: data.user_id ?? null,
		user: mapOrderUserInfo(data.user),
		tourOptionId: data.tour_option_id,
		tour,
		duration: tour.duration,
		route: tour.route,
		comment: data.comment ?? undefined,
		tourAmount: data.tour_amount,
		paidAmount: data.paid_amount
	};
};

export const mapBookingOrderListToFrontend = (
	data: TBookingOrderListItemBackend[]
): IOrder[] => data.map(mapBookingOrderListItemToFrontend);

export const mapBookingOrderPaginatedToFrontend = (
	response: TBookingOrderBackendResponse
): TBookingOrderPaginatedResponse => ({
	data: response.data.map(mapBookingOrderListItemToFrontend),
	total: response.total_count
});

export const mapBookingOrderFiltersToBackend = (
	filters: IBookingOrderFilters
): TBookingOrderPaginatedQuery => ({
	booking_status: orderStatusMapper.to(filters.status?.[0]),
	tour_id: filters.tourId || null,
	q: filters.search || null,
	date_from: filters.dateFrom || null,
	date_to: filters.dateTo || null,
	skip: (filters.page - 1) * filters.limit,
	limit: filters.limit
});
