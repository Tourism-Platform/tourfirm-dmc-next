import { type ENUM_ORDER_STATUS_TYPE } from "./order-status.types";

export interface IBookingOrderFilters {
	tourId?: string;
	status?: ENUM_ORDER_STATUS_TYPE[];
	dateFrom?: string | null;
	dateTo?: string | null;
	search: string;
	page: number;
	limit: number;
}
