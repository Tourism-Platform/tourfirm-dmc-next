import { formatToDollars } from "@/shared/utils";

import type {
	ICatalogPreviewOptionCard,
	ICatalogPreviewOptionDetailBackend,
	ICatalogPreviewOptionListItemBackend,
	IOptionDay,
	IOptionDetail,
	IOptionEvent,
	ISubOption,
	TCatalogPreviewPubEvent
} from "../types";
import type { ICatalogPreviewMultipleOptionEventBackend } from "../types/catalog-preview-backend.types";
import { ENUM_CATALOG_PREVIEW_OPTION_EVENT } from "../types/catalog-preview-option-event.types";
import type { TCatalogPreviewOptionEventType } from "../types/catalog-preview-option-event.types";

import { mapCatalogPreviewBackendTypToEventType } from "./catalog-preview-option-event-type.converters";
import { extractCityFromCatalogPreviewPubEvent } from "./catalog-preview-option-location.utils";
import { toCatalogPreviewPublicImageUrl } from "./catalog-preview-option-media.utils";
import {
	buildCatalogPreviewSheetFromMultiplyChild,
	buildCatalogPreviewSheetFromPubEvent
} from "./catalog-preview-option-sheet.converters";

const mapDetailToSubOption = (
	parentKey: string,
	index: number,
	detail: ICatalogPreviewMultipleOptionEventBackend["details"][number]
): ISubOption => {
	const sheet = buildCatalogPreviewSheetFromMultiplyChild(detail);

	return {
		id: `${parentKey}-sub-${index}`,
		title: detail.name,
		description: detail.description,
		sheet
	};
};

const mapMultiplyOptionEvent = (
	event: ICatalogPreviewMultipleOptionEventBackend
): IOptionEvent => {
	const eventKey = `d${event.day}-p${event.position}`;
	const sheet = buildCatalogPreviewSheetFromPubEvent(event);

	return {
		id: eventKey,
		type: ENUM_CATALOG_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION,
		title: event.name,
		description: event.description,
		sheet,
		sub_options: event.details.map((detail, index) =>
			mapDetailToSubOption(eventKey, index, detail)
		)
	};
};

const mapSinglePubEvent = (event: TCatalogPreviewPubEvent): IOptionEvent => {
	if (event.typ === "8") {
		return mapMultiplyOptionEvent(event);
	}

	const typ = event.typ ?? "7";
	const type: TCatalogPreviewOptionEventType =
		mapCatalogPreviewBackendTypToEventType(typ);
	const eventKey = `d${event.day}-p${event.position}`;
	const sheet = buildCatalogPreviewSheetFromPubEvent(event);

	return {
		id: eventKey,
		type,
		title: event.name,
		description: event.description,
		sheet
	};
};

const groupEventsIntoDays = (
	events: TCatalogPreviewPubEvent[]
): IOptionDay[] => {
	const byDay = new Map<number, TCatalogPreviewPubEvent[]>();

	for (const event of events) {
		const day = event.day;
		const list = byDay.get(day) ?? [];
		list.push(event);
		byDay.set(day, list);
	}

	return [...byDay.entries()]
		.sort(([a], [b]) => a - b)
		.map(([dayNumber, dayEvents]) => {
			const sorted = [...dayEvents].sort(
				(a, b) => a.position - b.position
			);
			const location =
				sorted
					.map(extractCityFromCatalogPreviewPubEvent)
					.find(Boolean) ?? "";

			return {
				id: `day-${dayNumber}`,
				day_number: dayNumber,
				location,
				events: sorted.map(mapSinglePubEvent)
			};
		});
};

const mapCatalogPreviewOptionPriceToFrontend = (
	backend: Pick<
		ICatalogPreviewOptionDetailBackend,
		"total_price" | "total_price_max"
	>
): string => {
	const min = backend.total_price.val;
	const max = backend.total_price_max.val;

	if (min === max) {
		return formatToDollars(min);
	}

	return `${formatToDollars(min)} - ${formatToDollars(max)}`;
};

const mapCatalogPreviewOptionPreviewToFrontend = (
	backend: ICatalogPreviewOptionListItemBackend
): ICatalogPreviewOptionCard => ({
	id: backend.id,
	title: backend.name ?? "",
	description: backend.description ?? "",
	price: mapCatalogPreviewOptionPriceToFrontend(backend),
	image: backend.cover_image_path
		? toCatalogPreviewPublicImageUrl(backend.cover_image_path)
		: ""
});

export const mapCatalogPreviewOptionsListToFrontend = (
	backend: ICatalogPreviewOptionListItemBackend[]
): ICatalogPreviewOptionCard[] =>
	backend.map(mapCatalogPreviewOptionPreviewToFrontend);

export const mapCatalogPreviewOptionToFrontend = (
	backend: ICatalogPreviewOptionDetailBackend,
	title = ""
): IOptionDetail => ({
	id: backend.id,
	title,
	price: mapCatalogPreviewOptionPriceToFrontend(backend),
	days: groupEventsIntoDays(backend.events)
});

export const enrichCatalogPreviewOptionDetailTitle = (
	detail: IOptionDetail,
	list: ICatalogPreviewOptionCard[] | undefined,
	optionId: string
): IOptionDetail => {
	if (detail.title) return detail;

	const name = list?.find((item) => item.id === optionId)?.title;

	return name ? { ...detail, title: name } : detail;
};
