import type { GeoFeature } from "@/shared/api";
import type { TGeoFormValue } from "@/shared/types/geo-form.types";

type TGeoFormLabelParts = Pick<
	TGeoFormValue,
	"name" | "street" | "housenumber" | "city" | "state" | "country"
>;

const mapGeoFormPartsToLabel = (value: TGeoFormLabelParts): string | null => {
	const parts = [
		value.name,
		[value.street, value.housenumber].filter(Boolean).join(" "),
		value.city,
		value.state,
		value.country
	].filter((part) => part && String(part).trim().length > 0);

	return parts.length > 0 ? parts.join(", ") : null;
};

export const mapGeoFeatureToFrontend = (feature: GeoFeature): TGeoFormValue => {
	const value = {
		lat: feature.lat,
		long: feature.long,
		name: feature.name ?? null,
		city: feature.city ?? null,
		street: feature.street ?? null,
		housenumber: feature.housenumber ?? null,
		postcode: feature.postcode ?? null,
		state: feature.state ?? null,
		country: feature.country ?? null,
		country_code: feature.country_code ?? null
	};

	return {
		...value,
		label: mapGeoFormPartsToLabel(value)
	};
};
