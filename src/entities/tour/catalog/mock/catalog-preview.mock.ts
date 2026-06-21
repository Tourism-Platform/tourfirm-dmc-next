import {
	CATALOG_PREVIEW_BACKEND_ACTIVITY_TYPE,
	CATALOG_PREVIEW_BACKEND_AMENITY,
	CATALOG_PREVIEW_BACKEND_LANGUAGE_CODE,
	CATALOG_PREVIEW_BACKEND_TRANSFER_TYPE,
	type ICatalogPreviewActivityEventBackend,
	type ICatalogPreviewBusEventBackend,
	type ICatalogPreviewFlightEventBackend,
	type ICatalogPreviewHousingEventBackend,
	type ICatalogPreviewInformationEventBackend,
	type ICatalogPreviewLocationBackend,
	type ICatalogPreviewMultipleOptionEventBackend,
	type ICatalogPreviewOperatorBackend,
	type ICatalogPreviewOptionDetailBackend,
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
import { DEFAULT_TOUR_PACKAGE_ID, TOUR_PACKAGE_MOCKS } from "./generated";

const defaultTourMock = TOUR_PACKAGE_MOCKS[DEFAULT_TOUR_PACKAGE_ID];

export const CATALOG_PREVIEW_TOUR_MOCK_ID = DEFAULT_TOUR_PACKAGE_ID;

export const CATALOG_PREVIEW_OPTION_MOCK_ID =
	defaultTourMock?.optionDetail.id ?? `${DEFAULT_TOUR_PACKAGE_ID}-default`;

export const CATALOG_PREVIEW_TOUR_LANDING_MOCK =
	defaultTourMock?.landing ?? ({} as ICatalogPreviewTourLandingBackend);

export const CATALOG_PREVIEW_TOUR_GENERAL_MOCK =
	defaultTourMock?.general ?? ({} as ICatalogPreviewTourGeneralBackend);

export const CATALOG_PREVIEW_OPERATOR_MOCK =
	defaultTourMock?.operator ?? ({} as ICatalogPreviewOperatorBackend);

export const CATALOG_PREVIEW_TOUR_OPTIONS_LIST_MOCK =
	defaultTourMock?.options ?? [];

export const CATALOG_PREVIEW_OPTION_BACKEND_MOCK =
	defaultTourMock?.optionDetail ?? ({} as ICatalogPreviewOptionDetailBackend);

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
