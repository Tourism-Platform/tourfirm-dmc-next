import type { LanguageCode } from "@/shared/api";
import type { IGeoSelectOption } from "@/shared/types/geo-form.types";

export type TGeoSearchParams = {
	q: string;
	lang?: LanguageCode;
	limit?: number;
};

export type TGeoOption = IGeoSelectOption;

export type { TGeoFormValue } from "@/shared/types/geo-form.types";
