import type { BOOKING_ORDER_OPERATOR_PATHS } from "@/shared/api";

export type TOperatorOrderDetailBackend = ReturnType<
	typeof BOOKING_ORDER_OPERATOR_PATHS.getOperatorBookingOrder
>["_types"]["response"];
