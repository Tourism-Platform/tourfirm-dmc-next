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
	toasts: {
		load: {
			error: "Failed to load orders"
		}
	},
	buttons: {
		back: "Back"
	},
	header: {
		orderStatus: "Order status"
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
			genders: {
				male: "Male",
				female: "Female"
			}
		}
	}
};
