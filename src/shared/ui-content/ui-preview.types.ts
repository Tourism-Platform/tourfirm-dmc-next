import type { TPluralForms } from "@/shared/lib/i18n/pluralize";

export type TUiPreviewHeroDuration = {
	daysOne: string;
	daysFew: string;
	daysMany: string;
	daysOther: string;
	nightsOne: string;
	nightsFew: string;
	nightsMany: string;
	nightsOther: string;
};

export type TUiPreviewHeroGroupSize = {
	personsOne: string;
	personsFew: string;
	personsMany: string;
	personsOther: string;
};

export type TUiPreviewTour = {
	pageName: string;
	back: string;
	notFound: string;
	bookNow: string;
	hero: {
		duration: TUiPreviewHeroDuration;
		groupSize: TUiPreviewHeroGroupSize;
		ageNoRestrictions: string;
		ageRequiresFrom: string;
		ageRequiresTo: string;
		ageRequiresRange: string;
	};
	sections: {
		overview: { title: string };
		cities: { label: string };
		languages: { label: string };
		included: { title: string };
		notIncluded: { title: string };
		meetingPickup: {
			title: string;
			start: string;
			pickupDetails: string;
			endPoint: string;
		};
		cancellation: { title: string };
		additionalInfo: { title: string };
		itinerary: {
			title: string;
			subtitle: string;
			card: {
				from: string;
				perPerson: string;
				priceDepends: string;
				viewItinerary: string;
				day: string;
				readMore: string;
				bookPackage: string;
			};
		};
	};
	provider: {
		title: string;
		additionalInfo: string;
	};
	tabs: {
		tourInformation: string;
		fullItinerary: string;
		pricing: string;
	};
	toasts: {
		load: { error: string };
		option: { error: string };
	};
};

export type TUiPreviewOption = {
	pageName: string;
	back: string;
	day: { title: string };
	sections: {
		option: {
			day: string;
			viewDetails: string;
			details: string;
			oneOfThem: string;
			readMore: string;
		};
	};
	tabs: {
		tourInformation: string;
		fullItinerary: string;
		pricing: string;
	};
	sheet: {
		pickupInfo: string;
		pickup: string;
		dropoff: string;
		to: string;
		amenities: string;
		scheduleInfo: string;
		nights: string;
		checkIn: string;
		checkOut: string;
		activityInfo: string;
		infoTime: string;
		location: string;
		startTime: string;
		endTime: string;
		flightInfo: string;
		cars: string;
		rooms: string;
		pax: string;
		guests: string;
		daysCount: string;
		nightsCount: string;
		terminal: string;
		gate: string;
		more: string;
	};
	pricing: {
		title: string;
		totalPrice: string;
		totalHint: string;
		details: string;
		detailsHint: string;
		choiceOf: string;
		or: string;
		accomodation: string;
		activity: string;
		transportation: string;
		sections: {
			accommodation: { blurb: string };
			activity: { blurb: string };
			transportation: { blurb: string };
		};
	};
};

export type TUiPreviewLabels = {
	languages: {
		english: string;
		russian: string;
		spanish: string;
		italian: string;
		french: string;
		chinese: string;
		japanese: string;
		uzbek: string;
		portuguese: string;
	};
	pickup: {
		airport: string;
		hotel: string;
	};
};

export type TUiPreview = {
	tour: TUiPreviewTour;
	option: TUiPreviewOption;
	labels: TUiPreviewLabels;
};

export type { TPluralForms };
