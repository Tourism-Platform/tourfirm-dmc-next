import type { TMultiEventPubOutput } from "@/shared/api";
import { formatToDollars } from "@/shared/utils";

import { ENUM_EVENT_BACKEND, type TEventBackendType } from "../lib";
import type {
	IOptionDay,
	IOptionDetail,
	IOptionEvent,
	IPreviewOptionCard,
	ISubOption,
	TOptionDetailBackend,
	TPreviewOptionListItemBackend
} from "../types";
import {
	ENUM_PREVIEW_OPTION_EVENT,
	type TPreviewOptionEventType
} from "../types/preview-option-event.types";

import { mapPreviewBackendTypToEventType } from "./preview-option-event-type.converters";
import { extractCityFromPubEvent } from "./preview-option-location.utils";
import { toPublicImageUrl } from "./preview-option-media.utils";
import {
	buildSheetFromMultiplyChild,
	buildSheetFromPubEvent
} from "./preview-option-sheet.converters";

type TPubEvent = TOptionDetailBackend["events"][number];

const mapDetailToSubOption = (
	parentKey: string,
	index: number,
	detail: NonNullable<TMultiEventPubOutput["details"]>[number]
): ISubOption => {
	const sheet = buildSheetFromMultiplyChild(detail);

	return {
		id: `${parentKey}-sub-${index}`,
		title: detail.name || "",
		description: detail.description || "",
		sheet
	};
};

const mapMultiplyOptionEvent = (event: TMultiEventPubOutput): IOptionEvent => {
	const eventKey = `d${event.day}-p${event.position}`;
	const sheet = buildSheetFromPubEvent(event);

	return {
		id: eventKey,
		type: ENUM_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION,
		title: event.name || "",
		description: event.description || "",
		sheet,
		sub_options: event?.details?.map((detail, index) =>
			mapDetailToSubOption(eventKey, index, detail)
		)
	};
};

const mapSinglePubEvent = (event: TPubEvent): IOptionEvent => {
	if (event.typ === ENUM_EVENT_BACKEND.OPTIONS) {
		return mapMultiplyOptionEvent(event as TMultiEventPubOutput);
	}

	const typ = event.typ ?? ENUM_EVENT_BACKEND.REF;
	const type: TPreviewOptionEventType = mapPreviewBackendTypToEventType(
		typ as TEventBackendType | undefined
	);
	const eventKey = `d${event.day}-p${event.position}`;
	const sheet = buildSheetFromPubEvent(event);

	return {
		id: eventKey,
		type,
		title: event.name || "",
		description: event.description || "",
		sheet
	};
};

const groupEventsIntoDays = (events: TPubEvent[]): IOptionDay[] => {
	const byDay = new Map<number, TPubEvent[]>();

	for (const event of events) {
		const day = event.day ?? 0;
		const list = byDay.get(day) ?? [];
		list.push(event);
		byDay.set(day, list);
	}

	return [...byDay.entries()]
		.sort(([a], [b]) => a - b)
		.map(([dayNumber, dayEvents]) => {
			const sorted = [...dayEvents].sort(
				(a, b) => (a.position ?? 0) - (b.position ?? 0)
			);
			const location =
				sorted.map(extractCityFromPubEvent).find(Boolean) ?? "";

			return {
				id: `day-${dayNumber}`,
				day_number: dayNumber,
				location,
				events: sorted.map(mapSinglePubEvent)
			};
		});
};

const mapPreviewOptionPriceToFrontend = (
	backend: Pick<TOptionDetailBackend, "total_price" | "total_price_max">
): string => {
	const min = backend.total_price.val;
	const max = backend.total_price_max.val;

	if (min === max) {
		return formatToDollars(min);
	}

	return `${formatToDollars(min)} - ${formatToDollars(max)}`;
};

const mapPreviewOptionPreviewToFrontend = (
	backend: TPreviewOptionListItemBackend
): IPreviewOptionCard => ({
	id: backend.id,
	title: backend.name ?? "",
	description: backend.description ?? "",
	price: mapPreviewOptionPriceToFrontend(backend),
	image: backend.cover_image_path
		? toPublicImageUrl(backend.cover_image_path)
		: ""
});

export const mapPreviewOptionsListToFrontend = (
	backend: TPreviewOptionListItemBackend[]
): IPreviewOptionCard[] => backend.map(mapPreviewOptionPreviewToFrontend);

export const mapPreviewOptionToFrontend = (
	backend: TOptionDetailBackend,
	title = ""
): IOptionDetail => ({
	id: backend.id,
	title,
	price: mapPreviewOptionPriceToFrontend(backend),
	days: groupEventsIntoDays(backend.events)
});

export const enrichOptionDetailTitle = (
	detail: IOptionDetail,
	list: IPreviewOptionCard[] | undefined,
	optionId: string
): IOptionDetail => {
	if (detail.title) return detail;

	const name = list?.find((item) => item.id === optionId)?.title;

	return name ? { ...detail, title: name } : detail;
};
