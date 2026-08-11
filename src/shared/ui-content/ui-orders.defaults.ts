import type { TUiOrders } from "./ui-orders.types";

export const DEFAULT_UI_ORDERS: TUiOrders = {
	pageName: "Orders",
	table: {
		orderId: "Order ID",
		tourName: "Tour name",
		pax: "PAX",
		dates: "Dates"
	},
	searchPlaceholder: "Search orders",
	empty: "No orders yet",
	statuses: {
		new: "New",
		inProcessing: "In processing",
		booking: "Booking",
		inProgress: "In progress",
		completed: "Completed",
		cancelled: "Cancelled"
	},
	invoiceStatuses: {
		draft: "Draft",
		sent: "Sent",
		partial: "Partial",
		paid: "Paid",
		overdue: "Overdue",
		cancelled: "Cancelled"
	},
	toasts: {
		load: {
			error: "Failed to load orders"
		}
	},
	buttons: {
		back: "Back",
		export: "Export"
	},
	header: {
		orderStatus: "Order status",
		invoiceStatus: "Invoice status"
	},
	orderInfo: {
		title: "Order info",
		fields: {
			tourName: "Tour name",
			type: "Type",
			pax: "PAX",
			route: "Route",
			duration: "Duration",
			dates: "Dates",
			comment: "Comment"
		}
	},
	contactInfo: {
		title: "Contact info",
		fields: {
			client: "Client",
			email: "Email",
			phone: "Phone number"
		}
	},
	report: {
		title: "Report"
	},
	tourReview: {
		title: "Tour review",
		table: {
			item: "Item"
		}
	},
	notFound: {
		title: "Order not found",
		description:
			"Sorry, we couldn't find the order with this ID. Please check the data or return to the order list."
	},
	paxInformation: {
		title: "PAX information",
		table: {
			fullName: "Full name",
			gender: "Gender",
			nationality: "Nationality",
			dateOfBirth: "Date of birth",
			passportNumber: "Passport #",
			expiredDate: "Expired date",
			comment: "Comment",
			file: "File",
			genders: {
				male: "Male",
				female: "Female"
			}
		}
	}
};
