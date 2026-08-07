import type {
	BOOKING_ORDER_PATHS,
	BookingOrderDetail,
	BookingOrderListItem
} from "@/shared/api";

export type TBookingOrderBackend = BookingOrderDetail;

export type TBookingOrderListItemBackend = BookingOrderListItem;

export type TBookingOrderDetailBackend = BookingOrderDetail;

export type TBookingOrderBackendResponse =
	typeof BOOKING_ORDER_PATHS.listMyBookings._types.response;

export type TBookingOrderPaginatedQuery =
	typeof BOOKING_ORDER_PATHS.listMyBookings._types.query;
