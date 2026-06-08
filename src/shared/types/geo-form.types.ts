/** Фронтовое значение geo-поля в react-hook-form */
export type TGeoFormValue = {
	lat: number;
	long: number;
	/** Label для инпута — задаётся в конвертерах при transform */
	label?: string | null;
	name?: string | null;
	city?: string | null;
	street?: string | null;
	housenumber?: string | null;
	postcode?: string | null;
	state?: string | null;
	country?: string | null;
	country_code?: string | null;
};

export interface IGeoSelectOption {
	label: string;
	value: string;
	feature: TGeoFormValue;
}
