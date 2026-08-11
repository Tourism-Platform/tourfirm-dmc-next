export type TUiOrders = {
	pageName: string;
	table: {
		orderId: string;
		tourName: string;
		pax: string;
		dates: string;
	};
	searchPlaceholder: string;
	empty: string;
	statuses: {
		new: string;
		inProcessing: string;
		booking: string;
		inProgress: string;
		completed: string;
		cancelled: string;
	};
	invoiceStatuses: {
		draft: string;
		sent: string;
		partial: string;
		paid: string;
		overdue: string;
		cancelled: string;
	};
	toasts: {
		load: {
			error: string;
		};
	};
	buttons: {
		back: string;
		export: string;
	};
	header: {
		orderStatus: string;
		invoiceStatus: string;
	};
	orderInfo: {
		title: string;
		fields: {
			tourName: string;
			type: string;
			pax: string;
			route: string;
			duration: string;
			dates: string;
			comment: string;
		};
	};
	contactInfo: {
		title: string;
		fields: {
			client: string;
			email: string;
			phone: string;
		};
	};
	report: {
		title: string;
	};
	tourReview: {
		title: string;
		table: {
			item: string;
		};
	};
	notFound: {
		title: string;
		description: string;
	};
	paxInformation: {
		title: string;
		table: {
			fullName: string;
			gender: string;
			nationality: string;
			dateOfBirth: string;
			passportNumber: string;
			expiredDate: string;
			comment: string;
			file: string;
			genders: {
				male: string;
				female: string;
			};
		};
	};
};
