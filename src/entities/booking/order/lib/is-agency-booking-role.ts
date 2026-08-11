import { UserRoles } from "@/shared/api";

const AGENCY_ROLES = new Set<string>([
	UserRoles.AgencyAdmin,
	UserRoles.AgencySalesManager,
	UserRoles.AgencyAccountant
]);

const OPERATOR_ROLES = new Set<string>([
	UserRoles.OperatorAdmin,
	UserRoles.OperatorSalesManager,
	UserRoles.OperatorAccountant
]);

export type TBookingOrderDetailApi = "user" | "agency" | "operator";

export const isAgencyBookingRole = (role: string | undefined): boolean =>
	Boolean(role && AGENCY_ROLES.has(role));

export const isOperatorBookingRole = (role: string | undefined): boolean =>
	Boolean(role && OPERATOR_ROLES.has(role));

export const resolveBookingOrderDetailApi = (
	role: string | undefined
): TBookingOrderDetailApi => {
	if (isAgencyBookingRole(role)) return "agency";
	if (isOperatorBookingRole(role)) return "operator";
	return "user";
};
