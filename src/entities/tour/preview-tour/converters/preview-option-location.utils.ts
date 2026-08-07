import type { TLocationOutSchema } from "@/shared/api";

import { ENUM_EVENT_BACKEND } from "../lib";
import type { TOptionDetailBackend } from "../types";

type TPubEvent = TOptionDetailBackend["events"][number];

export const isLocationOut = (
	location: unknown
): location is TLocationOutSchema =>
	typeof location === "object" &&
	location !== null &&
	"city" in location &&
	typeof (location as TLocationOutSchema).city === "string";

export const formatLocation = (location: unknown): string => {
	if (!isLocationOut(location)) return "";
	const city = location.city ?? "";
	const address = location.address ?? "";
	return address ? `${city}, ${address}` : city;
};

export const extractCityFromPubEvent = (
	event: TPubEvent
): string | undefined => {
	if (event.typ === ENUM_EVENT_BACKEND.OPTIONS) {
		const details = event.details;
		const firstDetail = Array.isArray(details) ? details[0] : undefined;
		if (firstDetail && "details" in firstDetail && firstDetail.details) {
			const nestedDetails = firstDetail.details as { location?: unknown };
			if (isLocationOut(nestedDetails.location)) {
				return nestedDetails.location.city ?? undefined;
			}
		}
		return undefined;
	}

	if (!("details" in event) || !event.details) {
		return undefined;
	}

	const details = event.details as Record<string, unknown>;

	if (isLocationOut(details.location)) {
		return details.location.city ?? undefined;
	}

	const hop = details.hop;
	if (Array.isArray(hop) && hop[0]) {
		const point = hop[0] as {
			departure?: { location?: unknown };
			arrival?: { location?: unknown };
		};
		if (isLocationOut(point.departure?.location)) {
			return point.departure.location.city ?? undefined;
		}
		if (isLocationOut(point.arrival?.location)) {
			return point.arrival.location.city ?? undefined;
		}
	}

	const departure = details.departure as { location?: unknown } | undefined;

	if (isLocationOut(departure?.location)) {
		return (departure!.location as TLocationOutSchema).city ?? undefined;
	}

	return undefined;
};
