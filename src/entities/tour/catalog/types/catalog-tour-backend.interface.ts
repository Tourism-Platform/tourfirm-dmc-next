import type {
	TPublicTourCatalogSchema,
	TTourCatalogPublicQuery
} from "@/shared/api";

export type TCatalogTourBackend = TPublicTourCatalogSchema;
export type TListCatalogToursBackendResponse = TPublicTourCatalogSchema[];
export type TCatalogTourQueryBackend = TTourCatalogPublicQuery;
