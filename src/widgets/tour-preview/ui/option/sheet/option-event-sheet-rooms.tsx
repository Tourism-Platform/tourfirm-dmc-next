"use client";

import { Bed, BedDouble, BedSingle, type LucideIcon } from "lucide-react";
import { type FC } from "react";

import { HousingRoomTypes } from "@/shared/api";
import { useUiContent } from "@/shared/ui-content";

import type { IOptionEventSheetRoom } from "@/entities/tour/preview-tour";

import { OptionEventSheetItemCard } from "./option-event-sheet-item-card";

const ROOM_ICONS: Record<HousingRoomTypes, LucideIcon> = {
	[HousingRoomTypes.Single]: BedSingle,
	[HousingRoomTypes.Double]: BedDouble,
	[HousingRoomTypes.Twin]: BedDouble,
	[HousingRoomTypes.Triple]: Bed,
	[HousingRoomTypes.Quadruple]: Bed,
	[HousingRoomTypes.Suite]: BedDouble,
	[HousingRoomTypes.Family]: Bed
};

const formatHousingRoomLabel = (value: HousingRoomTypes): string =>
	value.replace(/_/g, " ");

interface IOptionEventSheetRoomsProps {
	rooms: IOptionEventSheetRoom[];
}

export const OptionEventSheetRooms: FC<IOptionEventSheetRoomsProps> = ({
	rooms
}) => {
	const { preview } = useUiContent();
	const sheetTexts = preview.option.sheet;

	if (!rooms.length) return null;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{sheetTexts.rooms}</h4>
			<div className="flex flex-col gap-3">
				{rooms.map((room, index) => {
					const typeLabel = room.typ
						? formatHousingRoomLabel(room.typ)
						: "";
					const title = room.name || typeLabel;
					const subtitle =
						room.name && typeLabel && room.name !== typeLabel
							? typeLabel
							: undefined;

					return (
						<OptionEventSheetItemCard
							key={`${title}-${index}`}
							icon={room.typ ? ROOM_ICONS[room.typ] : Bed}
							title={title}
							subtitle={subtitle}
							badgeCount={room.pax}
							badgeLabel={
								room.pax != null ? sheetTexts.guests : undefined
							}
							description={room.description}
						/>
					);
				})}
			</div>
		</div>
	);
};
