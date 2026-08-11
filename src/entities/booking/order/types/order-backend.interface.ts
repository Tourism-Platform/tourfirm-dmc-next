import type {
	BOOKING_ORDER_PATHS,
	BookingOrderDetail,
	BookingOrderResponse,
	BookingOrderRow
} from "@/shared/api";

export type TBookingOrderBackend = BookingOrderResponse;

export type TBookingOrderListItemBackend = BookingOrderRow;

export type TBookingOrderDetailBackend = BookingOrderDetail;

export type TBookingOrderBackendResponse =
	typeof BOOKING_ORDER_PATHS.listMyBookings._types.response;

export type TBookingOrderPaginatedQuery =
	typeof BOOKING_ORDER_PATHS.listMyBookings._types.query;
