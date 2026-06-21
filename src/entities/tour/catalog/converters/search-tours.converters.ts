import type { DateRange } from "react-day-picker";

import { ENUM_PATH, type TQueryParams } from "@/shared/config";
import { formatDateToISO, fromatISOtoDate } from "@/shared/utils";

import type { TSearchTours } from "../schema";

type TCatalogSearchQuery = TQueryParams[typeof ENUM_PATH.MAIN.CATALOG.ROOT];

export const mapBackendDatesToDateRange = (
	dateFrom: string,
	dateTo: string
): DateRange => ({
	from: fromatISOtoDate(dateFrom),
	to: fromatISOtoDate(dateTo)
});

export const mapSearchToursToCatalogQuery = (
	data: TSearchTours
): TCatalogSearchQuery => ({
	destination: data.destination || undefined,
	checkIn: formatDateToISO(data.dates?.from),
	checkOut: formatDateToISO(data.dates?.to)
});

export const mapCatalogQueryToSearchTours = (
	query: TCatalogSearchQuery
): TSearchTours => {
	const from = fromatISOtoDate(query.checkIn);
	const to = fromatISOtoDate(query.checkOut);

	return {
		destination: query.destination ?? "",
		dates: from || to ? { from, to } : undefined
	};
};
