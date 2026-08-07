import { useMemo, useState } from "react";

import type { IPaginationRequest, IPaginationResponse } from "@/shared/types";

import type { IFilterOption } from "@/entities/tour";

type TUseQueryHook = (params: IPaginationRequest) => {
	data?: IPaginationResponse<IFilterOption>;
	isFetching: boolean;
};

interface IUseCatalogFilterParams {
	useQuery: TUseQueryHook;
	selectedValues?: string[];
	limit?: number;
}

export const useCatalogFilter = ({
	useQuery,
	selectedValues = [],
	limit = 5
}: IUseCatalogFilterParams) => {
	const [page, setPage] = useState(1);
	const { data: response, isFetching } = useQuery({ page, limit });

	const items = useMemo(() => {
		const data = response?.data || [];
		return data.map((item) => ({
			id: item.id,
			label: item.title,
			value: item.value,
			checked: selectedValues.includes(item.id)
		}));
	}, [response?.data, selectedValues]);

	const total = response?.total || 0;
	// Since we are appending data in RTK Query cache (merge), the length of data is the total loaded so far.
	// We compare it with the total availability on backend.
	const currentCount = response?.data?.length || 0;
	const hasMore = currentCount < total;

	const loadMore = () => setPage((prev) => prev + 1);

	return {
		items,
		isLoading: isFetching,
		hasMore,
		loadMore
	};
};
