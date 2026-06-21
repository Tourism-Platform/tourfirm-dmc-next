import type { ENUM_CATALOG_AMENITIES_TYPE } from "./catalog-labels.types";

export interface IOptionEventSheetPoint {
	place: string;
	dateTime: string;
}

export interface IOptionFlightSegment {
	airlineCode: string;
	flightNumber: string;
	route: string;
	dateRange: string;
	departureCode: string;
	departureTime: string;
	departurePlace: string;
	arrivalCode: string;
	arrivalTime: string;
	arrivalPlace: string;
}

export type TOptionEventSheetExtra =
	| { kind: "info" }
	| {
			kind: "transfer";
			pickup: IOptionEventSheetPoint;
			dropoff: IOptionEventSheetPoint;
	  }
	| {
			kind: "accommodation";
			amenities: ENUM_CATALOG_AMENITIES_TYPE[];
			nights: string;
			checkIn: string;
			checkOut: string;
	  }
	| {
			kind: "activity";
			location: string;
			startTime: string;
			endTime: string;
	  }
	| {
			kind: "flight";
			segments: IOptionFlightSegment[];
	  };

export interface IOptionEventSheet {
	images: string[];
	description: string;
	extra: TOptionEventSheetExtra;
}
