import type { DateRange } from "react-day-picker";

import { fromatISOtoDate } from "@/shared/utils";

import type { TSearchTours } from "../schema";
import type { TCatalogUrlQuery } from "../types/catalog-query.types";

import {
	mapCatalogQueryToLocationBar,
	mapLocationBarToCatalogQuery
} from "./catalog-query.converters";

export const mapBackendDatesToDateRange = (
	dateFrom: string,
	dateTo: string
): DateRange => ({
	from: fromatISOtoDate(dateFrom),
	to: fromatISOtoDate(dateTo)
});

export const mapSearchToursToCatalogQuery = (
	data: TSearchTours
): TCatalogUrlQuery => mapLocationBarToCatalogQuery(data);

export const mapCatalogQueryToSearchTours = (
	query: TCatalogUrlQuery
): TSearchTours => mapCatalogQueryToLocationBar(query);
