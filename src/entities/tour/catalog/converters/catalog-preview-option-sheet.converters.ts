import { format } from "date-fns";

import type {
	ICatalogPreviewActivityEventBackend,
	ICatalogPreviewBusEventBackend,
	ICatalogPreviewFlightEventBackend,
	ICatalogPreviewHousingEventBackend,
	ICatalogPreviewTimeBackend,
	ICatalogPreviewTrainEventBackend,
	ICatalogPreviewTransferEventBackend,
	TCatalogPreviewPubEvent,
	TCatalogPreviewPubEventDetail
} from "../types/catalog-preview-backend.types";
import type { TPubEventMediaFields } from "../types/catalog-preview-option-media.types";
import type {
	IOptionEventSheet,
	IOptionEventSheetPoint,
	IOptionFlightSegment,
	TOptionEventSheetExtra
} from "../types/catalog-preview-option-sheet.types";

import { catalogAmenitiesMapper } from "./catalog-labels.converters";
import { formatCatalogPreviewLocation } from "./catalog-preview-option-location.utils";
import { toCatalogPreviewPublicImageUrl } from "./catalog-preview-option-media.utils";

type TPubEventWithMedia = (
	| TCatalogPreviewPubEvent
	| TCatalogPreviewPubEventDetail
) &
	TPubEventMediaFields;

export const resolveCatalogPreviewEventImagePaths = (
	event: TCatalogPreviewPubEvent | TCatalogPreviewPubEventDetail
): string[] => {
	const media = event as TPubEventWithMedia;
	const paths =
		media.image_paths ??
		(media.primary_image_path ? [media.primary_image_path] : []);

	return paths
		.map(toCatalogPreviewPublicImageUrl)
		.filter(Boolean)
		.slice(0, 5);
};

const formatPubTime = (time?: ICatalogPreviewTimeBackend | null): string => {
	if (!time?.time) return "";
	const tz = time.timezone ?? 5;
	const sign = tz >= 0 ? "+" : "";
	return `${time.time.slice(0, 5)} UTC ${sign}${tz}`;
};

const formatJourneyPoint = (point?: {
	date?: string | null;
	time?: ICatalogPreviewTimeBackend | null;
	location?: unknown;
}): IOptionEventSheetPoint => {
	const place = formatCatalogPreviewLocation(point?.location) || "—";
	const datePart = point?.date ? format(new Date(point.date), "MMM d") : "";
	const timePart = formatPubTime(point?.time);
	const dateTime = [datePart, timePart].filter(Boolean).join(" • ") || "—";

	return { place, dateTime };
};

const mapTransferSheet = (
	event: ICatalogPreviewTransferEventBackend
): TOptionEventSheetExtra => ({
	kind: "transfer",
	pickup: formatJourneyPoint(event.details.departure),
	dropoff: formatJourneyPoint(event.details.arrival)
});

const mapHousingSheet = (
	event: ICatalogPreviewHousingEventBackend
): TOptionEventSheetExtra => ({
	kind: "accommodation",
	amenities: catalogAmenitiesMapper.fromMany(event.details.amenities ?? []),
	nights: `${event.details.duration} night${event.details.duration === 1 ? "" : "s"}`,
	checkIn: formatPubTime(event.details.check_in),
	checkOut: formatPubTime(event.details.check_out)
});

const mapActivitySheet = (
	event: ICatalogPreviewActivityEventBackend
): TOptionEventSheetExtra => ({
	kind: "activity",
	location: formatCatalogPreviewLocation(event.details.location) || "—",
	startTime: formatPubTime(event.details.start_time),
	endTime: formatPubTime(event.details.end_time)
});

const mapHopToSegment = (
	hop: ICatalogPreviewFlightEventBackend["details"]["hop"][number],
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
			departureTime: formatPubTime(hop.departure_time),
			departurePlace: `${formatCatalogPreviewLocation(hop.departure_location)}${hop.departure_terminal ? `, Terminal ${hop.departure_terminal}` : ""}${hop.departure_gate ? ` • Gate ${hop.departure_gate}` : ""}`,
			arrivalCode: hop.arrival_airport_code ?? "",
			arrivalTime: formatPubTime(hop.arrival_time),
			arrivalPlace: formatCatalogPreviewLocation(hop.arrival_location)
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
		departureTime: formatPubTime(dep?.time),
		departurePlace: formatCatalogPreviewLocation(dep?.location),
		arrivalCode: "—",
		arrivalTime: formatPubTime(arr?.time),
		arrivalPlace: formatCatalogPreviewLocation(arr?.location)
	};
};

const mapFlightSheet = (
	event: ICatalogPreviewFlightEventBackend,
	routeLabel: string
): TOptionEventSheetExtra => ({
	kind: "flight",
	segments: event.details.hop.map((hop) => mapHopToSegment(hop, routeLabel))
});

const mapTrainBusSheet = (
	event: ICatalogPreviewTrainEventBackend | ICatalogPreviewBusEventBackend,
	routeLabel: string
): TOptionEventSheetExtra => ({
	kind: "flight",
	segments: event.details.hop.map((hop) => mapHopToSegment(hop, routeLabel))
});

const mapSheetExtraFromPub = (
	event: TCatalogPreviewPubEvent | TCatalogPreviewPubEventDetail
): TOptionEventSheetExtra => {
	const typ = event.typ;

	switch (typ) {
		case "4":
			return mapTransferSheet(
				event as ICatalogPreviewTransferEventBackend
			);
		case "5":
			return mapHousingSheet(event as ICatalogPreviewHousingEventBackend);
		case "6":
			return mapActivitySheet(
				event as ICatalogPreviewActivityEventBackend
			);
		case "1":
			return mapFlightSheet(
				event as ICatalogPreviewFlightEventBackend,
				event.name
			);
		case "2":
			return mapTrainBusSheet(
				event as ICatalogPreviewTrainEventBackend,
				event.name
			);
		case "3":
			return mapTrainBusSheet(
				event as ICatalogPreviewBusEventBackend,
				event.name
			);
		default:
			return { kind: "info" };
	}
};

export const buildCatalogPreviewSheetFromPubEvent = (
	event: TCatalogPreviewPubEvent | TCatalogPreviewPubEventDetail
): IOptionEventSheet => ({
	images: resolveCatalogPreviewEventImagePaths(event),
	description: event.description,
	extra: mapSheetExtraFromPub(event)
});

export const buildCatalogPreviewSheetFromMultiplyChild = (
	detail: TCatalogPreviewPubEventDetail
): IOptionEventSheet => ({
	images: resolveCatalogPreviewEventImagePaths(detail),
	description: detail.description,
	extra: mapSheetExtraFromPub(detail)
});
