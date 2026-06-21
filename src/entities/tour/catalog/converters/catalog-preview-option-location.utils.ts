import type {
	ICatalogPreviewLocationBackend,
	TCatalogPreviewPubEvent
} from "../types";

export const isCatalogPreviewLocationOut = (
	location: unknown
): location is ICatalogPreviewLocationBackend =>
	typeof location === "object" &&
	location !== null &&
	"city" in location &&
	typeof (location as ICatalogPreviewLocationBackend).city === "string";

export const formatCatalogPreviewLocation = (location: unknown): string => {
	if (!isCatalogPreviewLocationOut(location)) return "";
	const city = location.city ?? "";
	const address = location.address ?? "";
	return address ? `${city}, ${address}` : city;
};

export const extractCityFromCatalogPreviewPubEvent = (
	event: TCatalogPreviewPubEvent
): string | undefined => {
	if (event.typ === "8") {
		const first = event.details[0];
		if (first && "details" in first && first.details) {
			const details = first.details as { location?: unknown };
			if (isCatalogPreviewLocationOut(details.location)) {
				return details.location.city ?? undefined;
			}
		}
		return undefined;
	}

	if (!("details" in event) || !event.details) {
		return undefined;
	}

	const details = event.details as Record<string, unknown>;

	if (isCatalogPreviewLocationOut(details.location)) {
		return details.location.city ?? undefined;
	}

	const hop = details.hop;
	if (Array.isArray(hop) && hop[0]) {
		const point = hop[0] as {
			departure?: { location?: unknown };
			arrival?: { location?: unknown };
		};
		if (isCatalogPreviewLocationOut(point.departure?.location)) {
			return point.departure.location.city ?? undefined;
		}
		if (isCatalogPreviewLocationOut(point.arrival?.location)) {
			return point.arrival.location.city ?? undefined;
		}
	}

	const departure = details.departure as { location?: unknown } | undefined;

	if (isCatalogPreviewLocationOut(departure?.location)) {
		return departure!.location.city ?? undefined;
	}

	return undefined;
};
