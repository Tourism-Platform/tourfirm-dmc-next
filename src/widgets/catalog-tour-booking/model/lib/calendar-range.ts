import {
	addMonths,
	endOfMonth,
	format,
	startOfMonth,
	startOfToday
} from "date-fns";

export interface IPreviewCalendarRange {
	from: string;
	to: string;
	month: Date;
}

export const getPreviewCalendarRangeForMonth = (
	month: Date
): IPreviewCalendarRange => ({
	from: format(startOfMonth(month), "yyyy-MM-dd"),
	to: format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd"),
	month
});

export const getInitialPreviewCalendarRange = (): IPreviewCalendarRange =>
	getPreviewCalendarRangeForMonth(startOfToday());
