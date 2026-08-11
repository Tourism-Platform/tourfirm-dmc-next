import {
	ENUM_EVENT_BACKEND,
	ENUM_PREVIEW_OPTION_EVENT,
	type TEventBackendType,
	mapPreviewBackendTypToEventType
} from "@/entities/tour/preview-tour";

import type {
	IOrderTourReviewItem,
	TBookingItineraryBackend,
	TBookingItineraryEventBackend
} from "../types";

type TBookingItinerarySingleEvent = Exclude<
	TBookingItineraryEventBackend,
	{ typ: "options" }
>;

const buildEventId = (
	typ: string | null | undefined,
	day: number | null | undefined,
	position: number | null | undefined,
	index: number,
	optionIndex?: number
): string => {
	const base = `${typ ?? "event"}-${day ?? 0}-${position ?? 0}-${index}`;
	return optionIndex === undefined ? base : `${base}:${optionIndex}`;
};

const mapSingleEventToItem = (
	event: TBookingItinerarySingleEvent,
	index: number,
	optionIndex = 0
): IOrderTourReviewItem => ({
	id: buildEventId(event.typ, event.day, event.position, index, optionIndex),
	item: event.name ?? "-",
	type: mapPreviewBackendTypToEventType(
		event.typ as TEventBackendType | undefined
	),
	day: event.day ?? 0,
	position: event.position ?? 0,
	optionIndex
});

const mapEventToItem = (
	event: TBookingItineraryEventBackend,
	index: number
): IOrderTourReviewItem => {
	if (event.typ === ENUM_EVENT_BACKEND.OPTIONS) {
		return {
			id: buildEventId(event.typ, event.day, event.position, index),
			item: event.name ?? "",
			type: ENUM_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION,
			day: event.day ?? 0,
			position: event.position ?? 0,
			optionIndex: 0,
			subRows: (event.details ?? []).map((detail, optionIndex) =>
				mapSingleEventToItem(
					detail as TBookingItinerarySingleEvent,
					index,
					optionIndex
				)
			)
		};
	}

	return mapSingleEventToItem(event, index);
};

export const mapBookingItineraryToTourReviewItems = (
	data?: TBookingItineraryBackend
): IOrderTourReviewItem[] => {
	if (!data) return [];

	return data.events.map(mapEventToItem);
};
