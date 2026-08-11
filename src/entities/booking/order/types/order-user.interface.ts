import type { ENUM_INVOICE_STATUS_TYPE } from "./invoice-status.types";
import type { ENUM_ORDER_STATUS_TYPE } from "./order-status.types";
import type { ENUM_ORDER_TYPE_OPTIONS_TYPE } from "./order-type.types";
import type {
	IOrderDates,
	IOrderOperatorInfo,
	IOrderTourInfo
} from "./order.interface";

export interface IUserOrderDetail {
	orderId: string;
	orderNumber: string;
	orderType: ENUM_ORDER_TYPE_OPTIONS_TYPE;
	status: ENUM_ORDER_STATUS_TYPE;
	pax: number;
	dates: IOrderDates;
	tourName: string;
	tourOptionId: string;
	tour: IOrderTourInfo;
	duration: string;
	route: string;
	comment?: string;
	tourAmount: string;
	paidAmount: string;
	operator: IOrderOperatorInfo;
	report?: string;
	invoiceStatus?: ENUM_INVOICE_STATUS_TYPE;
}
