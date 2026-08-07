import type { GeoFeature } from "@/shared/api";
import type { TGeoFormValue } from "@/shared/types/geo-form.types";

export const formatGeoFeatureLabel = (
	feature: TGeoFormValue | GeoFeature
): string => {
	const parts = [
		feature.name,
		[feature.street, feature.housenumber].filter(Boolean).join(" "),
		feature.city,
		feature.state,
		feature.country
	].filter((part) => part && String(part).trim().length > 0);

	return parts.join(", ") || `${feature.lat}, ${feature.long}`;
};

export const formatGeoFormDisplayLabel = (value: TGeoFormValue): string =>
	value.label ?? "";
