import type { IPreviewOptionCard } from "./preview-option.types";
import type { IPreviewTourGeneral } from "./preview-tour-general.types";
import type { IPreviewTourData } from "./preview-tour.types";

export interface IResolvedTourId {
	tourId: string;
	general: IPreviewTourGeneral;
	landing: IPreviewTourData;
	options: IPreviewOptionCard[];
}
