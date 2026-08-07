"use client";

import { Coffee, Dumbbell, type LucideIcon, Star, Wifi } from "lucide-react";
import { type FC } from "react";

import { AmenitiesTypes } from "@/shared/api";
import { useUiContent } from "@/shared/ui-content";

const AMENITY_ICONS: Partial<Record<AmenitiesTypes, LucideIcon>> = {
	[AmenitiesTypes.Wifi]: Wifi,
	[AmenitiesTypes.Gym]: Dumbbell,
	[AmenitiesTypes.Restaurant]: Coffee,
	[AmenitiesTypes.Spa]: Star,
	[AmenitiesTypes.Breakfast]: Coffee,
	[AmenitiesTypes.Pool]: Star
};

const formatAmenityLabel = (value: AmenitiesTypes): string =>
	value.replace(/_/g, " ");

interface IOptionEventSheetAmenitiesProps {
	amenities: AmenitiesTypes[];
}

export const OptionEventSheetAmenities: FC<IOptionEventSheetAmenitiesProps> = ({
	amenities
}) => {
	const { preview } = useUiContent();

	if (!amenities.length) return null;

	return (
		<div>
			<h4 className="mb-3 font-semibold">
				{preview.option.sheet.amenities}
			</h4>
			<div className="flex flex-wrap gap-4">
				{amenities.map((amenity) => {
					const Icon = AMENITY_ICONS[amenity] ?? Wifi;

					return (
						<div
							key={amenity}
							className="flex items-center gap-2 text-sm"
						>
							<Icon className="text-primary size-4 shrink-0" />
							<span className="capitalize">
								{formatAmenityLabel(amenity)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
