import { formatDate } from "@/shared/utils";

import {
	ENUM_CLIENT_TYPE_OPTIONS,
	type IBookingOrderFilters,
	type IOrder,
	type IOrderAgencyInfo,
	type IOrderDetail,
	type IOrderTourInfo,
	type IOrderUserInfo,
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
	agency: TBookingOrderDetailBackend["agency"]
): IOrderAgencyInfo => ({
	id: agency?.id ?? "",
	name: agency?.name ?? "",
	businessName: agency?.business_name ?? "",
	contactPerson: agency?.contact_person ?? "",
	contactEmail: agency?.contact_email ?? "",
	contactPhone: agency?.contact_phone ?? ""
});

const mapOrderUserInfo = (
	user: TBookingOrderDetailBackend["user"]
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

const mapOrderTourInfo = (
	tour: TBookingOrderDetailBackend["tour"]
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
	tourName: data.tour_name ?? "",
	status: orderStatusMapper.from(data.status)!
});

export const mapBookingOrderDetailToFrontend = (
	data: TBookingOrderDetailBackend
): IOrderDetail => {
	const { order, tour: tourRaw, agency, user } = data;
	const tour = mapOrderTourInfo(tourRaw);

	return {
		orderId: order.id,
		orderNumber: order.order_number || order.id,
		orderType: tour.type,
		dateCreated: "",
		client: "",
		clientType: ENUM_CLIENT_TYPE_OPTIONS.AGENCY,
		pax: order.pax,
		dates: {
			from: formatDate(order.date),
			to: formatDate(order.end_date)
		},
		tourName: tour.name,
		status: orderStatusMapper.from(order.status)!,
		agencyId: order.agency_id ?? "",
		agency: mapOrderAgencyInfo(agency),
		userId: order.user_id ?? null,
		user: mapOrderUserInfo(user),
		tourOptionId: order.tour_option_id,
		tour,
		duration: tour.duration,
		route: tour.route,
		comment: order.comment ?? undefined,
		tourAmount: order.tour_amount,
		paidAmount: order.paid_amount
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
): TBookingOrderPaginatedQuery => {
	const params: TBookingOrderPaginatedQuery = {
		skip: (filters.page - 1) * filters.limit,
		limit: filters.limit
	};

	const bookingStatus = orderStatusMapper.to(filters.status?.[0]);
	if (bookingStatus) params.booking_status = bookingStatus;
	if (filters.tourId) params.tour_id = filters.tourId;
	if (filters.search) params.q = filters.search;
	if (filters.dateFrom) params.date_from = filters.dateFrom;
	if (filters.dateTo) params.date_to = filters.dateTo;

	return params;
};
