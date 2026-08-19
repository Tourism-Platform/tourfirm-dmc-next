import type {
	AmenitiesTypes,
	HousingRoomTypes,
	VehicleBodyType
} from "@/shared/api";

export interface IOptionEventSheetPoint {
	place: string;
	dateTime: string;
}

export interface IOptionEventSheetImage {
	imagePath: string;
	isPrimary: boolean;
}

export interface IOptionEventSheetCar {
	typ: VehicleBodyType | null;
	pax: number | null;
	description: string;
}

export interface IOptionEventSheetRoom {
	name: string;
	typ: HousingRoomTypes | null;
	pax: number | null;
	description: string;
}

export interface IOptionFlightSegment {
	airlineCode: string;
	flightNumber: string;
	route: string;
	dateRange: string;
	departureCode: string;
	departureTime: string;
	departurePlace: string;
	departureTerminal: string | null;
	departureGate: string | null;
	arrivalCode: string;
	arrivalTime: string;
	arrivalPlace: string;
}

export type TOptionEventSheetExtra =
	| { kind: "info"; startTime: string; endTime: string }
	| {
			kind: "transfer";
			pickup: IOptionEventSheetPoint;
			dropoff: IOptionEventSheetPoint;
			cars: IOptionEventSheetCar[];
	  }
	| {
			kind: "accommodation";
			amenities: AmenitiesTypes[];
			nights: number;
			checkIn: string;
			checkOut: string;
			rooms: IOptionEventSheetRoom[];
	  }
	| { kind: "activity"; location: string; startTime: string; endTime: string }
	| { kind: "flight"; segments: IOptionFlightSegment[] };

export interface IOptionEventSheet {
	images: IOptionEventSheetImage[];
	description: string;
	extra: TOptionEventSheetExtra;
}
