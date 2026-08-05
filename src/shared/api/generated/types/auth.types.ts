export enum UserRoles {
	Admin = "admin",
	OperatorAdmin = "operator_admin",
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant",
	AgencyAdmin = "agency_admin",
	AgencySalesManager = "agency_sales_manager",
	AgencyAccountant = "agency_accountant",
	AuthenticatedUser = "authenticated_user"
}

export type TMeSchema = {
	id: string;
	email: string;
	role: string;
	picture?: string | null;
	agency_id?: string | null;
	operator_id?: string | null;
};

export type TMyAccountRead = {
	email: string;
	first_name: string | null;
	last_name: string | null;
	profile_picture_path: string | null;
};
