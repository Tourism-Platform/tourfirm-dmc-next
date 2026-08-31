import { useGetTourBySlugQuery } from "./preview-tour.service";

export const useResolvedTourId = (slug: string) => {
	const query = useGetTourBySlugQuery(slug, { skip: !slug });

	return {
		tourId: query.data?.tourId,
		general: query.data?.general,
		landing: query.data?.landing,
		options: query.data?.options ?? [],
		isResolving: query.isLoading,
		isResolveError: query.isError
	};
};
