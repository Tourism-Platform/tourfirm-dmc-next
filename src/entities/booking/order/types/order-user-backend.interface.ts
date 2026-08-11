import type { BOOKING_ORDER_USER_PATHS } from "@/shared/api";

export type TUserOrderDetailBackend = ReturnType<
	typeof BOOKING_ORDER_USER_PATHS.getUserBookingOrder
>["_types"]["response"];
