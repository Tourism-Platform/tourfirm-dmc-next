"use client";

import { type FC } from "react";

import type { IOptionEventSheet } from "@/entities/tour/preview-tour";

import { OptionEventSheetActivityInfo } from "./option-event-sheet-activity-info";
import { OptionEventSheetAmenities } from "./option-event-sheet-amenities";
import { OptionEventSheetCars } from "./option-event-sheet-cars";
import { OptionEventSheetDetails } from "./option-event-sheet-details";
import { OptionEventSheetFlightInfo } from "./option-event-sheet-flight-info";
import { OptionEventSheetGallery } from "./option-event-sheet-gallery";
import { OptionEventSheetInfoTime } from "./option-event-sheet-info-time";
import { OptionEventSheetPickupInfo } from "./option-event-sheet-pickup-info";
import { OptionEventSheetRooms } from "./option-event-sheet-rooms";
import { OptionEventSheetScheduleInfo } from "./option-event-sheet-schedule-info";

interface IOptionEventSheetBodyProps {
	sheet: IOptionEventSheet;
}

export const OptionEventSheetBody: FC<IOptionEventSheetBodyProps> = ({
	sheet
}) => {
	const { extra } = sheet;

	return (
		<div className="flex flex-col gap-6">
			<OptionEventSheetGallery images={sheet.images} />
			<OptionEventSheetDetails description={sheet.description} />

			{extra.kind === "transfer" && (
				<>
					<OptionEventSheetPickupInfo
						pickup={extra.pickup}
						dropoff={extra.dropoff}
					/>
					<OptionEventSheetCars cars={extra.cars} />
				</>
			)}

			{extra.kind === "accommodation" && (
				<>
					<OptionEventSheetAmenities amenities={extra.amenities} />
					<OptionEventSheetScheduleInfo
						nights={extra.nights}
						checkIn={extra.checkIn}
						checkOut={extra.checkOut}
					/>
					<OptionEventSheetRooms rooms={extra.rooms} />
				</>
			)}

			{extra.kind === "activity" && (
				<OptionEventSheetActivityInfo
					location={extra.location}
					startTime={extra.startTime}
					endTime={extra.endTime}
				/>
			)}

			{extra.kind === "info" && (
				<OptionEventSheetInfoTime
					startTime={extra.startTime}
					endTime={extra.endTime}
				/>
			)}

			{extra.kind === "flight" && (
				<OptionEventSheetFlightInfo segments={extra.segments} />
			)}
		</div>
	);
};
