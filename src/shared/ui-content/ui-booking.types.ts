export type TUiBooking = {
	pageName: string;
	backToTour: string;
	stepper: {
		step1: { label: string; title: string };
		step2: { label: string; title: string };
		step3: { label: string; title: string };
	};
	step1: {
		startDate: { title: string; description: string };
		calendar: {
			available: string;
			soldOut: string;
			selected: string;
		};
		travellers: {
			title: string;
			description: string;
			maxLimit: string;
			errors: { min: string; max: string };
		};
		options: {
			title: string;
			description: string;
			locked: string;
			perPerson: string;
			errors: { required: string };
		};
		fields: {
			date: { errors: { required: string } };
		};
		continue: string;
	};
	step2: {
		title: string;
		description: string;
		traveller: string;
		lead: string;
		makeLead: string;
		optionalHint: string;
		showAll: string;
		hideAll: string;
		addTraveller: string;
		filled: string;
		fields: {
			firstName: { label: string; errors: { required: string } };
			lastName: { label: string; errors: { required: string } };
			gender: {
				label: string;
				options: { male: string; female: string };
			};
			dateOfBirth: { label: string; errors: { required: string } };
			nationality: {
				label: string;
				placeholder: string;
				empty: string;
				errors: { required: string; invalid: string };
			};
			passportNumber: { label: string; errors: { required: string } };
			passportExpiry: { label: string; errors: { required: string } };
			note: { label: string };
			file: {
				label: string;
				clickToUpload: string;
				orDrag: string;
				formats: string;
				errors: { required: string };
			};
		};
		back: string;
		submit: string;
	};
	step3: {
		successTitle: string;
		successDesc: string;
		bookingId: string;
		copied: string;
		copyFailed: string;
		summary: {
			title: string;
			tour: string;
			startDate: string;
			endDate: string;
			travellers: string;
			package: string;
			estimatedTotal: string;
		};
		timeline: {
			requestSubmitted: { title: string; desc: string };
			providerReview: { title: string; desc: string };
			bookingConfirmed: { title: string; desc: string };
			paymentInfo: { title: string; desc: string };
			voucherTime: { title: string; desc: string };
		};
		viewMyBookings: string;
		catalogue: string;
	};
	sidebar: {
		title: string;
		startDate: string;
		endDate: string;
		duration: string;
		travellers: string;
		package: string;
		pricePerPerson: string;
		estimatedTotal: string;
		notSelected: string;
		days: string;
		person: string;
	};
};
