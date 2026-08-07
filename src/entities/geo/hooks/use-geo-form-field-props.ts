import type { TFormGeo } from "@/shared/types";

import { useGeoSearchOptions } from "./use-geo-search-options";

export type TGeoFieldProps = Pick<
	TFormGeo,
	"options" | "onQueryChange" | "isLoading"
>;

export const useGeoSearchFieldProps = (
	locale: string = "en"
): TGeoFieldProps => {
	const geo = useGeoSearchOptions({ locale });

	return {
		options: geo.options,
		onQueryChange: geo.setQuery,
		isLoading: geo.isLoading
	};
};
