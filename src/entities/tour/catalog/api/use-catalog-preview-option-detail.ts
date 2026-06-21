import { useMemo } from "react";

import { enrichCatalogPreviewOptionDetailTitle } from "../converters";
import type { IOptionDetail } from "../types";

import {
	useGetCatalogPreviewOptionQuery,
	useGetCatalogPreviewTourOptionsQuery
} from "./catalog-preview.service";

interface IUseCatalogPreviewOptionDetailArgs {
	tourId: string;
	optionId: string;
	skip?: boolean;
}

export const useCatalogPreviewOptionDetail = ({
	tourId,
	optionId,
	skip = false
}: IUseCatalogPreviewOptionDetailArgs) => {
	const shouldSkip = skip || !tourId || !optionId;

	const query = useGetCatalogPreviewOptionQuery(
		{ tourId, optionId },
		{ skip: shouldSkip }
	);

	const { data: optionsList } = useGetCatalogPreviewTourOptionsQuery(tourId, {
		skip: shouldSkip
	});

	const data = useMemo((): IOptionDetail | undefined => {
		if (!query.data) return undefined;

		return enrichCatalogPreviewOptionDetailTitle(
			query.data,
			optionsList,
			optionId
		);
	}, [query.data, optionsList, optionId]);

	return {
		...query,
		data
	};
};
