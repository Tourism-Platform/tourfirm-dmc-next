import {
	ENUM_PREVIEW_OPTION_EVENT,
	type IOptionDay,
	type IOptionEvent,
	type TOptionSheetSource
} from "@/entities/tour/preview-tour";

export type TPricingAccommodationRow =
	| { kind: "single"; source: TOptionSheetSource }
	| { kind: "multiply"; sources: TOptionSheetSource[] };

export interface IPricingDetailsLists {
	accommodation: TPricingAccommodationRow[];
	activity: TOptionSheetSource[];
	transportation: TOptionSheetSource[];
}

const isAccommodationSheet = (event: IOptionEvent | TOptionSheetSource) =>
	event.sheet.extra.kind === "accommodation";

const toSource = (event: TOptionSheetSource): TOptionSheetSource => ({
	title: event.title,
	sheet: event.sheet
});

export const groupPricingEvents = (
	days: IOptionDay[] | undefined
): IPricingDetailsLists => {
	const result: IPricingDetailsLists = {
		accommodation: [],
		activity: [],
		transportation: []
	};

	const events = days?.flatMap((day) => day.events) ?? [];

	for (const event of events) {
		switch (event.type) {
			case ENUM_PREVIEW_OPTION_EVENT.ACCOMMODATION:
				result.accommodation.push({
					kind: "single",
					source: toSource(event)
				});
				break;

			case ENUM_PREVIEW_OPTION_EVENT.MULTIPLY_OPTION: {
				const hotelSources =
					event.sub_options
						?.filter(isAccommodationSheet)
						.map(toSource) ?? [];

				if (hotelSources.length > 0) {
					result.accommodation.push({
						kind: "multiply",
						sources: hotelSources
					});
				}
				break;
			}

			case ENUM_PREVIEW_OPTION_EVENT.ACTIVITY:
				result.activity.push(toSource(event));
				break;

			case ENUM_PREVIEW_OPTION_EVENT.TRANSPORTATION:
				result.transportation.push(toSource(event));
				break;

			default:
				break;
		}
	}

	return result;
};
