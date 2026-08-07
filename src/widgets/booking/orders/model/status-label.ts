import type { TUiOrders } from "@/shared/ui-content";

import {
	ENUM_ORDER_STATUS,
	type ENUM_ORDER_STATUS_TYPE
} from "@/entities/booking";

export function getOrderStatusLabel(
	statuses: TUiOrders["statuses"],
	status: ENUM_ORDER_STATUS_TYPE
): string {
	const map = {
		[ENUM_ORDER_STATUS.NEW]: statuses.new,
		[ENUM_ORDER_STATUS.IN_PROCESSING]: statuses.inProcessing,
		[ENUM_ORDER_STATUS.BOOKING]: statuses.booking,
		[ENUM_ORDER_STATUS.IN_PROGRESS]: statuses.inProgress,
		[ENUM_ORDER_STATUS.COMPLETED]: statuses.completed,
		[ENUM_ORDER_STATUS.CANCELLED]: statuses.cancelled
	} as const;

	return map[status];
}
