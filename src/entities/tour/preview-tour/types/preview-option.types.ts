import type { TPreviewOptionEventType } from "./preview-option-event.types";
import type { IOptionEventSheet } from "./preview-option-sheet.types";

export interface ISubOption {
	id: string;
	title: string;
	description: string;
	sheet: IOptionEventSheet;
}

export interface IOptionEvent {
	id: string;
	type: TPreviewOptionEventType;
	title: string;
	description: string;
	sheet: IOptionEventSheet;
	sub_options?: ISubOption[];
}

/** Event or sub-option — enough data to open the detail sheet. */
export type TOptionSheetSource = Pick<IOptionEvent, "title" | "sheet">;

export interface IOptionDay {
	id: string;
	day_number: number;
	location: string;
	events: IOptionEvent[];
}

export interface IOptionDetail {
	id: string;
	title: string;
	price: string;
	days: IOptionDay[];
}

export interface IPreviewOptionCard {
	id: string;
	title: string;
	description: string;
	price: string;
	image: string;
}
