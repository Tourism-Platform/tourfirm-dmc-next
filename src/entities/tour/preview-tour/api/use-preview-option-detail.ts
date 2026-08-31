import { useMemo } from "react";

import { enrichOptionDetailTitle } from "../converters";
import type { IOptionDetail, IPreviewOptionCard } from "../types";

import { useGetPreviewOptionQuery } from "./preview-tour.service";

interface IUsePreviewOptionDetailArgs {
	tourId: string;
	optionId: string;
	options?: IPreviewOptionCard[];
	skip?: boolean;
}

export const usePreviewOptionDetail = ({
	tourId,
	optionId,
	options,
	skip = false
}: IUsePreviewOptionDetailArgs) => {
	const shouldSkip = skip || !tourId || !optionId;

	const query = useGetPreviewOptionQuery(
		{ tourId, optionId },
		{ skip: shouldSkip }
	);

	const data = useMemo((): IOptionDetail | undefined => {
		if (!query.data) return undefined;

		return enrichOptionDetailTitle(query.data, options, optionId);
	}, [optionId, options, query.data]);

	return {
		...query,
		data
	};
};
