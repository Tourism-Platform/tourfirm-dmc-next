import { format } from "date-fns";

import type {
	ActivityEventPubReadOutput,
	BusEventPubReadOutput,
	EmptyDetails,
	EventImagePubSchema,
	FlightEventPubReadOutput,
	HousingEventPubReadOutput,
	HousingRoomTypes,
	InformationEventPubReadOutput,
	MultiEventPubOutput,
	TimeSchema,
	TrainEventPubReadOutput,
	TransferEventPubReadOutput,
	VehicleBodyType
} from "@/shared/api";

import type { TOptionDetailBackend } from "../types";
import type {
	IOptionEventSheet,
	IOptionEventSheetCar,
	IOptionEventSheetImage,
	IOptionEventSheetPoint,
	IOptionEventSheetRoom,
	IOptionFlightSegment,
	TOptionEventSheetExtra
} from "../types/preview-option-sheet.types";

import { formatLocation } from "./preview-option-location.utils";
import { toPublicImageUrl } from "./preview-option-media.utils";

type TPubEvent = TOptionDetailBackend["events"][number];
type TPubDetail = NonNullable<MultiEventPubOutput["details"]>[number];

const mapPubImagesToSheet = (
	images?: EventImagePubSchema[]
): IOptionEventSheetImage[] =>
	(images ?? [])
		.map((image) => ({
			imagePath: toPublicImageUrl(image.image_path),
			isPrimary: image.is_primary
		}))
		.filter((image) => Boolean(image.imagePath))
		.slice(0, 5);

const formatPubTime = (time?: TimeSchema | null): string => {
	if (!time?.time) return "";
	const tz = time.timezone ?? 5;
	const sign = tz >= 0 ? "+" : "";
	return `${time.time.slice(0, 5)} UTC ${sign}${tz}`;
};

const formatJourneyPoint = (point?: {
	date?: string | null;
	time?: TimeSchema | null;
	location?: unknown;
}): IOptionEventSheetPoint => {
	const place = formatLocation(point?.location) || "—";
	const datePart = point?.date ? format(new Date(point.date), "dd/MM") : "";
	const timePart = formatPubTime(point?.time);
	const dateTime = [datePart, timePart].filter(Boolean).join(" • ") || "—";

	return { place, dateTime };
};

type TSheetCarSource = {
	typ?: VehicleBodyType | null;
	pax?: number | null;
	description?: string | null;
};

type TSheetRoomSource = {
	name?: string | null;
	typ?: HousingRoomTypes | null;
	pax?: number | null;
	description?: string | null;
};

type TSheetRoomCategorySource = {
	rooms?: TSheetRoomSource[] | null;
};

const hasCars = (
	expenses: unknown
): expenses is { cars?: TSheetCarSource[] | null } =>
	Boolean(expenses && typeof expenses === "object" && "cars" in expenses);

const hasRooms = (
	expenses: unknown
): expenses is {
	rooms?: TSheetRoomSource[] | null;
	categories?: TSheetRoomCategorySource[] | null;
} =>
	Boolean(
		expenses &&
		typeof expenses === "object" &&
		("rooms" in expenses || "categories" in expenses)
	);

const mapSheetCarsFromExpenses = (
	expenses: unknown
): IOptionEventSheetCar[] => {
	if (!hasCars(expenses) || !expenses.cars?.length) return [];

	return expenses.cars
		.filter((car) => car.typ || car.description || car.pax)
		.map((car) => ({
			typ: car.typ ?? null,
			pax: car.pax ?? null,
			description: car.description ?? ""
		}));
};

const mapSheetRoomsFromExpenses = (
	expenses: unknown
): IOptionEventSheetRoom[] => {
	if (!hasRooms(expenses)) return [];

	if (expenses.rooms?.length) {
		return expenses.rooms
			.filter(
				(room) => room.name || room.typ || room.description || room.pax
			)
			.map((room) => ({
				name: room.name ?? "",
				typ: room.typ ?? null,
				pax: room.pax ?? null,
				description: room.description ?? ""
			}));
	}

	return (
		expenses.categories?.flatMap((category) =>
			(category.rooms ?? [])
				.filter(
					(room) =>
						room.typ || room.description || room.pax || room.name
				)
				.map((room) => ({
					name: room.name ?? "",
					typ: room.typ ?? null,
					pax: room.pax ?? null,
					description: room.description ?? ""
				}))
		) ?? []
	);
};

const mapTransferSheet = (
	event: { typ: "transfer" } & TransferEventPubReadOutput
): TOptionEventSheetExtra => ({
	kind: "transfer",
	pickup: formatJourneyPoint(event?.details?.departure ?? undefined),
	dropoff: formatJourneyPoint(event?.details?.arrival ?? undefined),
	cars: mapSheetCarsFromExpenses(event?.details?.expenses)
});

const mapHousingSheet = (
	event: { typ: "housing" } & HousingEventPubReadOutput
): TOptionEventSheetExtra => ({
	kind: "accommodation",
	amenities: event?.details?.amenities ?? [],
	nights: event?.details?.duration ?? 0,
	checkIn: formatPubTime(event?.details?.check_in ?? undefined),
	checkOut: formatPubTime(event?.details?.check_out ?? undefined),
	rooms: mapSheetRoomsFromExpenses(event?.details?.expenses)
});

const mapActivitySheet = (
	event: { typ: "activity" } & ActivityEventPubReadOutput
): TOptionEventSheetExtra => ({
	kind: "activity",
	location: formatLocation(event?.details?.location ?? undefined) || "—",
	startTime: formatPubTime(event?.details?.start_time ?? undefined),
	endTime: formatPubTime(event?.details?.end_time ?? undefined)
});

const mapInfoSheet = (
	event: { typ: "ref" } & InformationEventPubReadOutput
): TOptionEventSheetExtra => {
	// Pub OpenAPI still types details as EmptyDetailsPub; runtime has start/end.
	const details = event.details as EmptyDetails | undefined;
	return {
		kind: "info",
		startTime: formatPubTime(details?.start_time ?? undefined),
		endTime: formatPubTime(details?.end_time ?? undefined)
	};
};

const mapHopToSegment = (
	hop: {
		airline_code?: string;
		flight_number?: number;
		departure_airport_code?: string;
		arrival_airport_code?: string;
		departure_location?: unknown;
		arrival_location?: unknown;
		departure_date?: string;
		arrival_date?: string;
		departure_time?: TimeSchema;
		arrival_time?: TimeSchema;
		departure_terminal?: string;
		departure_gate?: string;
		departure?: {
			location?: unknown;
			date?: string | null;
			time?: TimeSchema;
		};
		arrival?: {
			location?: unknown;
			date?: string | null;
			time?: TimeSchema;
		};
	},
	routeLabel: string
): IOptionFlightSegment => {
	if ("departure_airport_code" in hop && hop.departure_airport_code) {
		const depDate = hop.departure_date
			? format(new Date(hop.departure_date), "dd/MM/yyyy")
			: "";
		const arrDate = hop.arrival_date
			? format(new Date(hop.arrival_date), "dd/MM/yyyy")
			: "";
		return {
			airlineCode: hop.airline_code ?? "",
			flightNumber: String(hop.flight_number ?? ""),
			route: routeLabel,
			dateRange: [depDate, arrDate].filter(Boolean).join(" - "),
			departureCode: hop.departure_airport_code,
			departureTime: formatPubTime(hop.departure_time ?? undefined),
			departurePlace: formatLocation(hop.departure_location ?? undefined),
			departureTerminal: hop.departure_terminal ?? null,
			departureGate: hop.departure_gate ?? null,
			arrivalCode: hop.arrival_airport_code ?? "",
			arrivalTime: formatPubTime(hop.arrival_time ?? undefined),
			arrivalPlace: formatLocation(hop.arrival_location ?? undefined)
		};
	}

	const dep = hop.departure;
	const arr = hop.arrival;
	return {
		airlineCode: "",
		flightNumber: "",
		route: routeLabel,
		dateRange: [dep?.date, arr?.date]
			.filter((d): d is string => Boolean(d))
			.map((d) => format(new Date(d), "dd/MM/yyyy"))
			.join(" - "),
		departureCode: "—",
		departureTime: formatPubTime(dep?.time ?? undefined),
		departurePlace: formatLocation(dep?.location ?? undefined),
		departureTerminal: null,
		departureGate: null,
		arrivalCode: "—",
		arrivalTime: formatPubTime(arr?.time ?? undefined),
		arrivalPlace: formatLocation(arr?.location ?? undefined)
	};
};

const mapFlightSheet = (
	event: { typ: "flight" } & FlightEventPubReadOutput,
	routeLabel: string
): TOptionEventSheetExtra => ({
	kind: "flight",
	segments:
		event?.details?.hop?.map((hop) =>
			mapHopToSegment(hop as any, routeLabel)
		) ?? []
});

const mapTrainBusSheet = (
	event:
		| ({ typ: "train" } & TrainEventPubReadOutput)
		| ({ typ: "bus" } & BusEventPubReadOutput),
	routeLabel: string
): TOptionEventSheetExtra => ({
	kind: "flight",
	segments:
		event?.details?.hop?.map((hop) =>
			mapHopToSegment(hop as any, routeLabel)
		) ?? []
});

const mapSheetExtraFromPub = (
	event: TPubEvent | TPubDetail
): TOptionEventSheetExtra => {
	const typ = event.typ;

	switch (typ) {
		case "transfer":
			return mapTransferSheet(
				event as { typ: "transfer" } & TransferEventPubReadOutput
			);
		case "housing":
			return mapHousingSheet(
				event as { typ: "housing" } & HousingEventPubReadOutput
			);
		case "activity":
			return mapActivitySheet(
				event as { typ: "activity" } & ActivityEventPubReadOutput
			);
		case "flight":
			return mapFlightSheet(
				event as { typ: "flight" } & FlightEventPubReadOutput,
				event.name || ""
			);
		case "train":
			return mapTrainBusSheet(
				event as { typ: "train" } & TrainEventPubReadOutput,
				event.name || ""
			);
		case "bus":
			return mapTrainBusSheet(
				event as { typ: "bus" } & BusEventPubReadOutput,
				event.name || ""
			);
		case "ref":
			return mapInfoSheet(
				event as { typ: "ref" } & InformationEventPubReadOutput
			);
		default:
			return { kind: "info", startTime: "", endTime: "" };
	}
};

export const buildSheetFromPubEvent = (
	event: TPubEvent | TPubDetail
): IOptionEventSheet => {
	return {
		images: mapPubImagesToSheet(event.images),
		description: event.description || "",
		extra: mapSheetExtraFromPub(event)
	};
};

export const buildSheetFromMultiplyChild = (
	detail: TPubDetail
): IOptionEventSheet => ({
	images: mapPubImagesToSheet(detail.images),
	description: detail.description || "",
	extra: mapSheetExtraFromPub(detail)
});
