import { useMemo } from "react";

import { enrichOptionDetailTitle } from "../converters";
import type { IOptionDetail } from "../types";

import {
	useGetPreviewOptionQuery,
	useGetPreviewTourOptionsQuery
} from "./preview-tour.service";

interface IUsePreviewOptionDetailArgs {
	tourId: string;
	optionId: string;
	skip?: boolean;
}

export const usePreviewOptionDetail = ({
	tourId,
	optionId,
	skip = false
}: IUsePreviewOptionDetailArgs) => {
	const shouldSkip = skip || !tourId || !optionId;

	const query = useGetPreviewOptionQuery(
		{ tourId, optionId },
		{ skip: shouldSkip }
	);

	const { data: optionsList } = useGetPreviewTourOptionsQuery(tourId, {
		skip: shouldSkip
	});

	const data = useMemo((): IOptionDetail | undefined => {
		if (!query.data) return undefined;

		return enrichOptionDetailTitle(query.data, optionsList, optionId);
	}, [query.data, optionsList, optionId]);

	return {
		...query,
		data
	};
};
