import type { AmenitiesTypes } from "@/shared/api";

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
	| {
			kind: "info";
			startTime: string;
			endTime: string;
	  }
	| {
			kind: "transfer";
			pickup: IOptionEventSheetPoint;
			dropoff: IOptionEventSheetPoint;
	  }
	| {
			kind: "accommodation";
			amenities: AmenitiesTypes[];
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
