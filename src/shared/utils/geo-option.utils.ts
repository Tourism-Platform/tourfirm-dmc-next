const GEO_VALUE_SEPARATOR = ",";

export const encodeGeoOptionValue = (lat: number, long: number): string =>
	`${lat}${GEO_VALUE_SEPARATOR}${long}`;

export const decodeGeoOptionValue = (
	value: string
): { lat: number; long: number } | null => {
	const [latRaw, longRaw] = value.split(GEO_VALUE_SEPARATOR, 2);
	const lat = Number(latRaw);
	const long = Number(longRaw);

	if (!Number.isFinite(lat) || !Number.isFinite(long)) {
		return null;
	}

	return { lat, long };
};
