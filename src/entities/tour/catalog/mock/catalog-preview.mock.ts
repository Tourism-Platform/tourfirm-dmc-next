import type { ICatalogPreviewOperatorBackend } from "../types";
import {
	CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE,
	CATALOG_PREVIEW_BACKEND_AMENITY,
	CATALOG_PREVIEW_BACKEND_CURRENCY,
	CATALOG_PREVIEW_BACKEND_LANGUAGE,
	CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE,
	CATALOG_PREVIEW_BACKEND_PICKUP_TYPE,
	CATALOG_PREVIEW_BACKEND_TOUR_CATEGORY,
	CATALOG_PREVIEW_BACKEND_TOUR_STATUS,
	CATALOG_PREVIEW_BACKEND_TOUR_TYPE,
	CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE,
	type ICatalogPreviewActivityEventBackend,
	type ICatalogPreviewBusEventBackend,
	type ICatalogPreviewFlightEventBackend,
	type ICatalogPreviewHousingEventBackend,
	type ICatalogPreviewInformationEventBackend,
	type ICatalogPreviewLocationBackend,
	type ICatalogPreviewMultipleOptionEventBackend,
	type ICatalogPreviewOptionDetailBackend,
	type ICatalogPreviewOptionListItemBackend,
	type ICatalogPreviewTimeBackend,
	type ICatalogPreviewTourGeneralBackend,
	type ICatalogPreviewTourLandingBackend,
	type ICatalogPreviewTrainEventBackend,
	type ICatalogPreviewTransferEventBackend
} from "../types/catalog-preview-backend.types";

import {
	CATALOG_PREVIEW_MOCK_IMAGE_URLS,
	withCatalogPreviewEventMedia
} from "./catalog-preview-option-media.mock";

export const CATALOG_PREVIEW_TOUR_MOCK_ID =
	"9f2b3d82-5c4d-4b9f-9f7a-1a42e71d1b11";

export const CATALOG_PREVIEW_OPTION_MOCK_ID =
	"1f2b3d82-5c4d-4b9f-9f7a-1a42e71d1b11";

const time = (t: string): ICatalogPreviewTimeBackend => ({
	time: t,
	timezone: 5
});

export const catalogPreviewLocationTashkent =
	(): ICatalogPreviewLocationBackend => ({
		lang: CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE.En,
		city: "Tashkent",
		address: "Tashkent",
		lat: 41.2995,
		long: 69.2401
	});

export const catalogPreviewLocationSamarkand =
	(): ICatalogPreviewLocationBackend => ({
		lang: CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE.En,
		city: "Samarkand",
		address: "Samarkand",
		lat: 39.6542,
		long: 66.9597
	});

export const catalogPreviewLocationAirportTashkent =
	(): ICatalogPreviewLocationBackend => ({
		lang: CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE.En,
		city: "Tashkent",
		address: "Tashkent International Airport",
		lat: 41.2579,
		long: 69.2812
	});

const housingDetails = (city: ICatalogPreviewLocationBackend) => ({
	location: city,
	amenities: [
		CATALOG_PREVIEW_BACKEND_AMENITY.Wifi,
		CATALOG_PREVIEW_BACKEND_AMENITY.Breakfast
	],
	duration: 1,
	check_in: time("14:00:00"),
	check_out: time("12:00:00")
});

export const catalogPreviewInfoEvent = (
	day: number,
	position: number,
	name: string,
	description: string
): ICatalogPreviewInformationEventBackend => ({
	typ: "7",
	name,
	description,
	day,
	position,
	details: {}
});

export const catalogPreviewFlightEvent = (
	day: number,
	position: number,
	name: string,
	description: string
): ICatalogPreviewFlightEventBackend => ({
	typ: "1",
	name,
	description,
	day,
	position,
	details: {
		hop: [
			{
				airline_code: "HY",
				flight_number: 101,
				departure_airport_code: "IST",
				arrival_airport_code: "TAS",
				departure_location: catalogPreviewLocationAirportTashkent(),
				arrival_location: catalogPreviewLocationTashkent(),
				departure_date: "2026-06-01",
				arrival_date: "2026-06-01",
				departure_time: time("08:30:00"),
				arrival_time: time("14:45:00"),
				departure_terminal: "1",
				departure_gate: "A1"
			}
		]
	}
});

export const catalogPreviewTransferEvent = (
	day: number,
	position: number,
	name: string,
	description: string
): ICatalogPreviewTransferEventBackend => ({
	typ: "4",
	name,
	description,
	day,
	position,
	details: {
		typ: CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE.AirportTransfer,
		departure: {
			date: "2026-06-01",
			time: time("15:00:00"),
			location: catalogPreviewLocationAirportTashkent()
		},
		arrival: {
			date: "2026-06-01",
			time: time("16:00:00"),
			location: catalogPreviewLocationTashkent()
		}
	}
});

export const catalogPreviewTrainEvent = (
	day: number,
	position: number,
	name: string,
	description: string
): ICatalogPreviewTrainEventBackend => ({
	typ: "2",
	name,
	description,
	day,
	position,
	details: {
		hop: [
			{
				departure: {
					date: "2026-06-02",
					time: time("08:00:00"),
					location: catalogPreviewLocationTashkent()
				},
				arrival: {
					date: "2026-06-02",
					time: time("10:30:00"),
					location: catalogPreviewLocationSamarkand()
				}
			}
		]
	}
});

export const catalogPreviewBusEvent = (
	day: number,
	position: number,
	name: string,
	description: string
): ICatalogPreviewBusEventBackend => ({
	typ: "3",
	name,
	description,
	day,
	position,
	details: {
		hop: [
			{
				departure: {
					date: "2026-06-02",
					time: time("17:30:00"),
					location: catalogPreviewLocationSamarkand()
				},
				arrival: {
					date: "2026-06-02",
					time: time("18:15:00"),
					location: catalogPreviewLocationSamarkand()
				}
			}
		]
	}
});

export const catalogPreviewHousingEvent = (
	day: number,
	position: number,
	name: string,
	description: string,
	city: ICatalogPreviewLocationBackend
): ICatalogPreviewHousingEventBackend => ({
	typ: "5",
	name,
	description,
	day,
	position,
	details: housingDetails(city)
});

export const catalogPreviewActivityEvent = (
	day: number,
	position: number,
	name: string,
	description: string,
	city: ICatalogPreviewLocationBackend
): ICatalogPreviewActivityEventBackend => ({
	typ: "6",
	name,
	description,
	day,
	position,
	details: {
		typ: CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE.Sightseeing,
		location: city,
		start_time: time("09:00:00"),
		end_time: time("17:00:00")
	}
});

export const catalogPreviewMultiplyHotels = (
	day: number,
	position: number
): ICatalogPreviewMultipleOptionEventBackend => ({
	typ: "8",
	name: "Overnight in Tashkent (choose one)",
	description:
		"Stay in one of our partner hotels of the same category. Exact property is confirmed before departure.",
	day,
	position,
	details: [
		withCatalogPreviewEventMedia(
			catalogPreviewHousingEvent(
				day,
				1,
				"Holiday Inn Tashkent City (4*)",
				"Modern hotel near Amir Timur Square with rooftop bar and fitness centre.",
				catalogPreviewLocationTashkent()
			),
			[
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelA,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelB,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelC,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelD,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelE
			]
		),
		withCatalogPreviewEventMedia(
			catalogPreviewHousingEvent(
				day,
				2,
				"Uzbekistan Hotel (3*)",
				"Historic landmark hotel with central location and local cuisine restaurant.",
				catalogPreviewLocationTashkent()
			),
			[
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelB,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelC,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelD
			]
		),
		withCatalogPreviewEventMedia(
			catalogPreviewHousingEvent(
				day,
				3,
				"Ibis Styles Tashkent (3*)",
				"Design hotel in Yunusabad with metro access to the city centre.",
				catalogPreviewLocationTashkent()
			),
			[
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelC,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelD
			]
		)
	]
});

export const catalogPreviewMultiplyEvening = (
	day: number,
	position: number
): ICatalogPreviewMultipleOptionEventBackend => ({
	typ: "8",
	name: "Evening experience (choose one)",
	description:
		"Select one included evening activity. Tell your guide by 12:00 on day 1.",
	day,
	position,
	details: [
		withCatalogPreviewEventMedia(
			catalogPreviewActivityEvent(
				day,
				1,
				"State Conservatory chamber concert",
				"One-hour programme of Uzbek and European classics with reserved seating.",
				catalogPreviewLocationTashkent()
			),
			[CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityA]
		),
		withCatalogPreviewEventMedia(
			catalogPreviewActivityEvent(
				day,
				2,
				"Plov cooking masterclass",
				"Hands-on lesson with a local chef; tasting and recipe card included.",
				catalogPreviewLocationTashkent()
			),
			[CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityB]
		),
		withCatalogPreviewEventMedia(
			catalogPreviewActivityEvent(
				day,
				3,
				"Chorsu Bazaar night tour",
				"Guided walk through the covered market with dried fruit and bread tastings.",
				catalogPreviewLocationTashkent()
			),
			[CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityC]
		)
	]
});

const monetary = (val: number) => ({
	val,
	currency: CATALOG_PREVIEW_BACKEND_CURRENCY.USD
});

export const CATALOG_PREVIEW_TOUR_LANDING_MOCK: ICatalogPreviewTourLandingBackend =
	{
		title: "Title",
		images: [
			{
				id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
				image_url: CATALOG_PREVIEW_MOCK_IMAGE_URLS.cover,
				is_primary: true
			},
			{
				id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
				image_url: CATALOG_PREVIEW_MOCK_IMAGE_URLS.single1,
				is_primary: false
			},
			{
				id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
				image_url: CATALOG_PREVIEW_MOCK_IMAGE_URLS.single2,
				is_primary: false
			},
			{
				id: "d4e5f6a7-b8c9-0123-def0-234567890123",
				image_url: CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelA,
				is_primary: false
			},
			{
				id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
				image_url: CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityA,
				is_primary: false
			}
		],
		overview:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Embark on an unforgettable journey through the ancient cities of Uzbekistan."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"bold"}],"text":"Discover the rich history, stunning architecture, and warm hospitality of the Silk Road."}]}]}',
		additional_information:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Embark on an unforgettable journey through the ancient cities of Uzbekistan."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"bold"}],"text":"Discover the rich history, stunning architecture, and warm hospitality of the Silk Road."}]}]}',
		description:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Embark on an unforgettable journey through the ancient cities of Uzbekistan."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"bold"}],"text":"Discover the rich history, stunning architecture, and warm hospitality of the Silk Road."}]}]}',
		languages: [
			CATALOG_PREVIEW_BACKEND_LANGUAGE.English,
			CATALOG_PREVIEW_BACKEND_LANGUAGE.Russian
		],
		amenities_included: [CATALOG_PREVIEW_BACKEND_AMENITY.Wifi],
		amenities_not_included: [CATALOG_PREVIEW_BACKEND_AMENITY.Wifi],
		pickup_type: [CATALOG_PREVIEW_BACKEND_PICKUP_TYPE.AirportPickup],
		pickup_description:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"We provide pickup from all major hotels in Tashkent and the international airport."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Please provide your arrival details at least 48 hours before the tour."}]}]}',
		cancellation_policy:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Full refund for cancellations made at least 7 days before the start date."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"bold"}],"text":"50% refund for cancellations between 3 and 7 days."},{"type":"hardBreak"},{"type":"text","text":"No refund for cancellations within 72 hours."}]}]}',
		overview_description:
			'{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Please wear comfortable walking shoes."},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Some sites require modest dress (shoulders and knees covered). Don\'t forget your camera!"}]}]}'
	};

export const CATALOG_PREVIEW_TOUR_GENERAL_MOCK: ICatalogPreviewTourGeneralBackend =
	{
		id: CATALOG_PREVIEW_TOUR_MOCK_ID,
		status: CATALOG_PREVIEW_BACKEND_TOUR_STATUS.Archived,
		operator_id: "123",
		schedule_id: "123",
		agency_id: "123",
		landing_id: "123",
		cover_image_path: "123",
		duration_hours: 10,
		typ: CATALOG_PREVIEW_BACKEND_TOUR_TYPE.Regular,
		name: "Embark on an Unforgettable Archaeological Journey",
		group_size: 15,
		group_size_min: null,
		days: 10,
		nights: 10,
		age_from: 18,
		age_to: 65,
		categories: [CATALOG_PREVIEW_BACKEND_TOUR_CATEGORY.AdventureOutdoor]
	};

export const CATALOG_PREVIEW_OPERATOR_MOCK: ICatalogPreviewOperatorBackend = {
	id: "op-1234-5678",
	business_name: "Silk Road Explorers",
	description: "We are the best operator in the region.",
	website_url: "https://example.com",
	contact_email: "contact@example.com",
	contact_phone: "+998 90 123 45 67",
	address_line: "Amir Timur st 1",
	city: "Tashkent",
	country: "Uzbekistan",
	logo_url:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFHUvc7-P766gQCjdtYsIRRZAtCxVBWsTH_4TaXTIgAg&s"
};

export const CATALOG_PREVIEW_TOUR_OPTIONS_LIST_MOCK: ICatalogPreviewOptionListItemBackend[] =
	[
		{
			id: CATALOG_PREVIEW_OPTION_MOCK_ID,
			name: "Silk Road Explorer — 6 Days Classic",
			description:
				"Six-day journey through Tashkent and Samarkand with train, guided monuments, and partner hotels.",
			cover_image_path: CATALOG_PREVIEW_MOCK_IMAGE_URLS.cover,
			total_price: monetary(983),
			total_price_max: monetary(1112),
			price_per_person: monetary(196),
			price_per_person_max: monetary(222)
		}
	];

export const CATALOG_PREVIEW_OPTION_BACKEND_MOCK: ICatalogPreviewOptionDetailBackend =
	{
		id: CATALOG_PREVIEW_OPTION_MOCK_ID,
		total_price: monetary(983),
		total_price_max: monetary(1112),
		events: [
			withCatalogPreviewEventMedia(
				catalogPreviewInfoEvent(
					1,
					1,
					"Arrival briefing & welcome",
					"Meet your representative at the airport, welcome pack, and lobby briefing at 15:00."
				),
				[]
			),
			withCatalogPreviewEventMedia(
				catalogPreviewFlightEvent(
					1,
					2,
					"International arrival flight",
					"Coordinated meet-and-greet for arrivals at Tashkent International Airport (TAS)."
				),
				[CATALOG_PREVIEW_MOCK_IMAGE_URLS.single1]
			),
			withCatalogPreviewEventMedia(
				catalogPreviewTransferEvent(
					1,
					3,
					"Airport to hotel transfer",
					"Shared air-conditioned minivan with bottled water; approx. 35–50 minutes."
				),
				[CATALOG_PREVIEW_MOCK_IMAGE_URLS.single2]
			),
			withCatalogPreviewEventMedia(catalogPreviewMultiplyHotels(1, 4), [
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.single3,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.single4
			]),
			withCatalogPreviewEventMedia(catalogPreviewMultiplyEvening(1, 5), [
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityA,
				CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityB
			]),
			withCatalogPreviewEventMedia(
				catalogPreviewTrainEvent(
					2,
					1,
					"Afrosiyob train to Samarkand",
					"High-speed train in comfort class; guide meets you on the platform."
				),
				[CATALOG_PREVIEW_MOCK_IMAGE_URLS.single3]
			),
			withCatalogPreviewEventMedia(
				catalogPreviewBusEvent(
					2,
					2,
					"Local bus to Registan area",
					"Short shared bus ride from the station district to the historic centre."
				),
				[CATALOG_PREVIEW_MOCK_IMAGE_URLS.single4]
			),
			withCatalogPreviewEventMedia(
				catalogPreviewActivityEvent(
					2,
					3,
					"Registan Square guided visit",
					"Half-day walking tour with licensed historian; entrance fees included.",
					catalogPreviewLocationSamarkand()
				),
				[
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityA,
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityB,
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.activityC
				]
			),
			withCatalogPreviewEventMedia(
				catalogPreviewHousingEvent(
					2,
					4,
					"Overnight in Samarkand",
					"Boutique hotel near the city centre with breakfast and Wi-Fi.",
					catalogPreviewLocationSamarkand()
				),
				[
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelA,
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelB,
					CATALOG_PREVIEW_MOCK_IMAGE_URLS.hotelC
				]
			)
		]
	};
