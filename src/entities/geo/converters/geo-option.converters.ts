import type { GeoFeature } from "@/shared/api";
import { formatGeoFeatureLabel } from "@/shared/utils/geo-display.utils";
import { encodeGeoOptionValue } from "@/shared/utils/geo-option.utils";

import type { TGeoOption } from "../types";

import { mapGeoFeatureToFrontend } from "./geo.converters";

export const mapGeoFeatureToOption = (feature: GeoFeature): TGeoOption => ({
	label: formatGeoFeatureLabel(feature),
	value: encodeGeoOptionValue(feature.lat, feature.long),
	feature: {
		...mapGeoFeatureToFrontend(feature),
		label: formatGeoFeatureLabel(feature)
	}
});

export const mapGeoFeaturesToOptions = (features: GeoFeature[]): TGeoOption[] =>
	features.map(mapGeoFeatureToOption);
