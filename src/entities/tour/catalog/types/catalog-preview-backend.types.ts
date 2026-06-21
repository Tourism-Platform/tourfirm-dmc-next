export const CATALOG_PREVIEW_BACKEND_TOUR_TYPE = {
	Regular: "regular",
	Custom: "custom"
} as const;

export type TCatalogPreviewBackendTourType =
	(typeof CATALOG_PREVIEW_BACKEND_TOUR_TYPE)[keyof typeof CATALOG_PREVIEW_BACKEND_TOUR_TYPE];

export const CATALOG_PREVIEW_BACKEND_TOUR_STATUS = {
	Draft: "draft",
	Published: "published",
	Archived: "archived"
} as const;

export type TCatalogPreviewBackendTourStatus =
	(typeof CATALOG_PREVIEW_BACKEND_TOUR_STATUS)[keyof typeof CATALOG_PREVIEW_BACKEND_TOUR_STATUS];

export const CATALOG_PREVIEW_BACKEND_TOUR_CATEGORY = {
	CulturalHistorical: "cultural_historical",
	ReligiousSpiritual: "religious_spiritual",
	Archaeological: "archaeological",
	AdventureOutdoor: "adventure_outdoor",
	EcoNature: "eco_nature",
	HikingTrekking: "hiking_trekking",
	CityTour: "city_tour",
	GastronomyCulinary: "gastronomy_culinary",
	PhotographyCreative: "photography_creative",
	Educational: "educational",
	MasterClassWorkshop: "master_class_workshop",
	WellnessSpa: "wellness_spa",
	YogaMeditation: "yoga_meditation",
	BusinessMice: "business_mice",
	FamilyKids: "family_kids",
	MultiDestination: "multi_destination"
} as const;

export type TCatalogPreviewBackendTourCategory =
	(typeof CATALOG_PREVIEW_BACKEND_TOUR_CATEGORY)[keyof typeof CATALOG_PREVIEW_BACKEND_TOUR_CATEGORY];

export const CATALOG_PREVIEW_BACKEND_LANGUAGE = {
	Uzbek: "uzbek",
	Russian: "russian",
	English: "english",
	Italian: "italian",
	German: "german",
	Spanish: "spanish",
	Portuguese: "portuguese"
} as const;

export type TCatalogPreviewBackendLanguage =
	(typeof CATALOG_PREVIEW_BACKEND_LANGUAGE)[keyof typeof CATALOG_PREVIEW_BACKEND_LANGUAGE];

export const CATALOG_PREVIEW_BACKEND_AMENITY = {
	Wifi: "wifi",
	Pool: "pool",
	Breakfast: "breakfast",
	Parking: "parking",
	Gym: "gym",
	Spa: "spa",
	Restaurant: "restaurant",
	Bar: "bar",
	AirportShuttle: "airport_shuttle",
	AirConditioning: "air_conditioning",
	RoomService: "room_service",
	Laundry: "laundry",
	Concierge: "concierge",
	BusinessCenter: "business_center",
	KidsClub: "kids_club",
	BeachAccess: "beach_access"
} as const;

export type TCatalogPreviewBackendAmenity =
	(typeof CATALOG_PREVIEW_BACKEND_AMENITY)[keyof typeof CATALOG_PREVIEW_BACKEND_AMENITY];

export const CATALOG_PREVIEW_BACKEND_PICKUP_TYPE = {
	AirportPickup: "airport_pickup",
	HotelPickup: "hotel_pickup"
} as const;

export type TCatalogPreviewBackendPickupType =
	(typeof CATALOG_PREVIEW_BACKEND_PICKUP_TYPE)[keyof typeof CATALOG_PREVIEW_BACKEND_PICKUP_TYPE];

export const CATALOG_PREVIEW_BACKEND_CURRENCY = {
	USD: "USD",
	EUR: "EUR",
	UZS: "UZS",
	RUB: "RUB",
	GBP: "GBP"
} as const;

export type TCatalogPreviewBackendCurrency =
	(typeof CATALOG_PREVIEW_BACKEND_CURRENCY)[keyof typeof CATALOG_PREVIEW_BACKEND_CURRENCY];

export const CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE = {
	En: "en",
	Ru: "ru",
	Uz: "uz"
} as const;

export type TCatalogPreviewBackendLanguageCode =
	(typeof CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE)[keyof typeof CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE];

export const CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE = {
	Sightseeing: "sightseeing"
} as const;

export type TCatalogPreviewBackendActivityType =
	(typeof CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE)[keyof typeof CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE];

export const CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE = {
	AirportTransfer: "airport_transfer"
} as const;

export type TCatalogPreviewBackendTransferType =
	(typeof CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE)[keyof typeof CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE];

export interface ICatalogPreviewMonetaryValueBackend {
	val: number;
	currency: TCatalogPreviewBackendCurrency;
}

export interface ICatalogPreviewLandingImageBackend {
	id: string;
	image_url: string;
	is_primary: boolean;
}

export interface ICatalogPreviewTourLandingBackend {
	title: string | null;
	overview: string | null;
	description: string | null;
	overview_description: string | null;
	pickup_description: string | null;
	additional_information: string | null;
	cancellation_policy: string | null;
	languages: TCatalogPreviewBackendLanguage[];
	pickup_type: TCatalogPreviewBackendPickupType[];
	amenities_included: string[];
	amenities_not_included: string[];
	images: ICatalogPreviewLandingImageBackend[];
}

export interface ICatalogPreviewTourGeneralBackend {
	id: string;
	operator_id: string;
	schedule_id: string | null;
	agency_id: string | null;
	landing_id: string | null;
	name: string;
	cover_image_path: string | null;
	group_size: number;
	group_size_min: number | null;
	days: number;
	nights: number;
	duration_hours: number | null;
	age_from: number | null;
	age_to: number | null;
	typ: TCatalogPreviewBackendTourType;
	status: TCatalogPreviewBackendTourStatus;
	categories: TCatalogPreviewBackendTourCategory[];
}

export interface ICatalogPreviewOperatorBackend {
	id: string;
	business_name: string | null;
	description: string | null;
	website_url: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	address_line: string | null;
	city: string | null;
	country: string | null;
	logo_url: string | null;
}

export interface ICatalogPreviewOptionListItemBackend {
	id: string;
	name: string | null;
	description?: string | null;
	cover_image_path?: string | null;
	total_price: ICatalogPreviewMonetaryValueBackend;
	total_price_max: ICatalogPreviewMonetaryValueBackend;
	price_per_person?: ICatalogPreviewMonetaryValueBackend;
	price_per_person_max?: ICatalogPreviewMonetaryValueBackend;
}

export interface ICatalogPreviewTimeBackend {
	time: string;
	timezone?: number;
}

export interface ICatalogPreviewLocationBackend {
	lang: TCatalogPreviewBackendLanguageCode;
	city?: string | null;
	address?: string | null;
	lat: number;
	long: number;
}

export interface ICatalogPreviewInformationEventBackend {
	typ: "7";
	name: string;
	description: string;
	day: number;
	position: number;
	details: Record<string, never>;
}

export interface ICatalogPreviewFlightHopBackend {
	airline_code?: string;
	flight_number?: number;
	departure_airport_code?: string;
	arrival_airport_code?: string;
	departure_location?: ICatalogPreviewLocationBackend;
	arrival_location?: ICatalogPreviewLocationBackend;
	departure_date?: string;
	arrival_date?: string;
	departure_time?: ICatalogPreviewTimeBackend;
	arrival_time?: ICatalogPreviewTimeBackend;
	departure_terminal?: string;
	departure_gate?: string;
	departure?: {
		location?: ICatalogPreviewLocationBackend;
		date?: string | null;
		time?: ICatalogPreviewTimeBackend;
	};
	arrival?: {
		location?: ICatalogPreviewLocationBackend;
		date?: string | null;
		time?: ICatalogPreviewTimeBackend;
	};
}

export interface ICatalogPreviewFlightEventBackend {
	typ: "1";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		hop: ICatalogPreviewFlightHopBackend[];
	};
}

export interface ICatalogPreviewTrainEventBackend {
	typ: "2";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		hop: ICatalogPreviewFlightHopBackend[];
	};
}

export interface ICatalogPreviewBusEventBackend {
	typ: "3";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		hop: ICatalogPreviewFlightHopBackend[];
	};
}

export interface ICatalogPreviewTransferEventBackend {
	typ: "4";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		typ: TCatalogPreviewBackendTransferType;
		departure: {
			date?: string;
			time?: ICatalogPreviewTimeBackend;
			location?: ICatalogPreviewLocationBackend;
		};
		arrival: {
			date?: string;
			time?: ICatalogPreviewTimeBackend;
			location?: ICatalogPreviewLocationBackend;
		};
	};
}

export interface ICatalogPreviewHousingEventBackend {
	typ: "5";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		location: ICatalogPreviewLocationBackend;
		amenities?: TCatalogPreviewBackendAmenity[];
		duration: number;
		check_in: ICatalogPreviewTimeBackend;
		check_out: ICatalogPreviewTimeBackend;
	};
}

export interface ICatalogPreviewActivityEventBackend {
	typ: "6";
	name: string;
	description: string;
	day: number;
	position: number;
	details: {
		typ: TCatalogPreviewBackendActivityType;
		location: ICatalogPreviewLocationBackend;
		start_time: ICatalogPreviewTimeBackend;
		end_time: ICatalogPreviewTimeBackend;
	};
}

export type TCatalogPreviewPubEventDetail =
	| ICatalogPreviewInformationEventBackend
	| ICatalogPreviewFlightEventBackend
	| ICatalogPreviewTrainEventBackend
	| ICatalogPreviewBusEventBackend
	| ICatalogPreviewTransferEventBackend
	| ICatalogPreviewHousingEventBackend
	| ICatalogPreviewActivityEventBackend;

export interface ICatalogPreviewMultipleOptionEventBackend {
	typ: "8";
	name: string;
	description: string;
	day: number;
	position: number;
	details: TCatalogPreviewPubEventDetail[];
}

export type TCatalogPreviewPubEvent =
	| TCatalogPreviewPubEventDetail
	| ICatalogPreviewMultipleOptionEventBackend;

export interface ICatalogPreviewOptionDetailBackend {
	id: string;
	total_price: ICatalogPreviewMonetaryValueBackend;
	total_price_max: ICatalogPreviewMonetaryValueBackend;
	events: TCatalogPreviewPubEvent[];
}
