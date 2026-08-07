import { format } from "date-fns";

import type {
	ActivityEventPubReadOutput,
	BusEventPubReadOutput,
	EmptyDetails,
	FlightEventPubReadOutput,
	HousingEventPubReadOutput,
	InformationEventPubReadOutput,
	MultiEventPubOutput,
	TimeSchema,
	TrainEventPubReadOutput,
	TransferEventPubReadOutput
} from "@/shared/api";

import type { TOptionDetailBackend } from "../types";
import type { TPubEventMediaFields } from "../types/preview-option-media.types";
import type {
	IOptionEventSheet,
	IOptionEventSheetPoint,
	IOptionFlightSegment,
	TOptionEventSheetExtra
} from "../types/preview-option-sheet.types";

import { formatLocation } from "./preview-option-location.utils";
import { toPublicImageUrl } from "./preview-option-media.utils";

type TPubEvent = TOptionDetailBackend["events"][number];
type TPubDetail = NonNullable<MultiEventPubOutput["details"]>[number];
type TPubEventWithMedia = (TPubEvent | TPubDetail) & TPubEventMediaFields;

export const resolveEventImagePaths = (
	event: TPubEvent | TPubDetail
): string[] => {
	const media = event as TPubEventWithMedia;
	const paths =
		media.image_paths ??
		(media.primary_image_path ? [media.primary_image_path] : []);

	return paths.map(toPublicImageUrl).filter(Boolean).slice(0, 5);
};

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
	const datePart = point?.date ? format(new Date(point.date), "MMM d") : "";
	const timePart = formatPubTime(point?.time);
	const dateTime = [datePart, timePart].filter(Boolean).join(" • ") || "—";

	return { place, dateTime };
};

const mapTransferSheet = (
	event: { typ: "transfer" } & TransferEventPubReadOutput
): TOptionEventSheetExtra => ({
	kind: "transfer",
	pickup: formatJourneyPoint(event?.details?.departure ?? undefined),
	dropoff: formatJourneyPoint(event?.details?.arrival ?? undefined)
});

const mapHousingSheet = (
	event: { typ: "housing" } & HousingEventPubReadOutput
): TOptionEventSheetExtra => ({
	kind: "accommodation",
	amenities: event?.details?.amenities ?? [],
	nights: `${event?.details?.duration} night${event?.details?.duration === 1 ? "" : "s"}`,
	checkIn: formatPubTime(event?.details?.check_in ?? undefined),
	checkOut: formatPubTime(event?.details?.check_out ?? undefined)
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
			? format(new Date(hop.departure_date), "d MMM, yyyy")
			: "";
		const arrDate = hop.arrival_date
			? format(new Date(hop.arrival_date), "d MMM, yyyy")
			: "";
		return {
			airlineCode: hop.airline_code ?? "",
			flightNumber: String(hop.flight_number ?? ""),
			route: routeLabel,
			dateRange: [depDate, arrDate].filter(Boolean).join(" - "),
			departureCode: hop.departure_airport_code,
			departureTime: formatPubTime(hop.departure_time ?? undefined),
			departurePlace: `${formatLocation(hop.departure_location ?? undefined)}${hop.departure_terminal ? `, Terminal ${hop.departure_terminal}` : ""}${hop.departure_gate ? ` • Gate ${hop.departure_gate}` : ""}`,
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
			.map((d) => format(new Date(d), "d MMM, yyyy"))
			.join(" - "),
		departureCode: "—",
		departureTime: formatPubTime(dep?.time ?? undefined),
		departurePlace: formatLocation(dep?.location ?? undefined),
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
		images: resolveEventImagePaths(event),
		description: event.description || "",
		extra: mapSheetExtraFromPub(event)
	};
};

export const buildSheetFromMultiplyChild = (
	detail: TPubDetail
): IOptionEventSheet => ({
	images: resolveEventImagePaths(detail),
	description: detail.description || "",
	extra: mapSheetExtraFromPub(detail)
});
