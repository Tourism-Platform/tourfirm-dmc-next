import { type IPaginationResponse } from "@/shared/types";

import { type ENUM_CLIENT_TYPE_OPTIONS_TYPE } from "./client-type.types";
import { type ENUM_ORDER_STATUS_TYPE } from "./order-status.types";
import { type ENUM_ORDER_TYPE_OPTIONS_TYPE } from "./order-type.types";

export interface IOrderDates {
	from: string;
	to: string;
}

export interface IOrderTourInfo {
	name: string;
	type: ENUM_ORDER_TYPE_OPTIONS_TYPE;
	days: number;
	nights: number;
	route: string;
	duration: string;
}

export interface IOrderAgencyInfo {
	id: string;
	name: string;
	businessName?: string | null;
	contactPerson?: string | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
}

export interface IOrderUserInfo {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	phoneNumber?: string | null;
}

export interface IOrderOperatorInfo {
	id: string;
	name: string;
	businessName?: string | null;
	contactPerson?: string | null;
	contactPosition?: string | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
	websiteUrl?: string | null;
	logoUrl?: string | null;
}

export interface IOrder {
	orderId: string;
	orderNumber?: string;
	orderType: ENUM_ORDER_TYPE_OPTIONS_TYPE;
	dateCreated: string;
	client: string;
	clientType: ENUM_CLIENT_TYPE_OPTIONS_TYPE;
	pax: number;
	dates: IOrderDates;
	tourName: string;
	manager?: string;
	status: ENUM_ORDER_STATUS_TYPE;
}

export interface IOrderDetail extends IOrder {
	agencyId: string;
	agency: IOrderAgencyInfo;
	userId?: string | null;
	user?: IOrderUserInfo | null;
	tourOptionId: string;
	tour: IOrderTourInfo;
	duration: string;
	route: string;
	comment?: string;
	tourAmount: string;
	paidAmount: string;
	email?: string;
	phone?: string;
	roomType?: string;
	carClass?: string;
	isAvailable?: boolean;
	report?: string;
}

export type TBookingOrderPaginatedResponse = IPaginationResponse<IOrder>;
