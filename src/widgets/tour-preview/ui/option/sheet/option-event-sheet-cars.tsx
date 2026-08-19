"use client";

import { Bus, Car, type LucideIcon } from "lucide-react";
import { type FC } from "react";

import { VehicleBodyType } from "@/shared/api";
import { useUiContent } from "@/shared/ui-content";

import type { IOptionEventSheetCar } from "@/entities/tour/preview-tour";

import { OptionEventSheetItemCard } from "./option-event-sheet-item-card";

const CAR_ICONS: Record<VehicleBodyType, LucideIcon> = {
	[VehicleBodyType.Sedan]: Car,
	[VehicleBodyType.Suv]: Car,
	[VehicleBodyType.Minivan]: Car,
	[VehicleBodyType.Minibus]: Bus,
	[VehicleBodyType.MinibusPlus]: Bus,
	[VehicleBodyType.Bus]: Bus,
	[VehicleBodyType.Coach]: Bus
};

const formatVehicleBodyLabel = (value: VehicleBodyType): string =>
	value.replace(/_/g, " ");

interface IOptionEventSheetCarsProps {
	cars: IOptionEventSheetCar[];
}

export const OptionEventSheetCars: FC<IOptionEventSheetCarsProps> = ({
	cars
}) => {
	const { preview } = useUiContent();
	const sheetTexts = preview.option.sheet;

	if (!cars.length) return null;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{sheetTexts.cars}</h4>
			<div className="flex flex-col gap-3">
				{cars.map((car, index) => {
					const title = car.typ
						? formatVehicleBodyLabel(car.typ)
						: "";

					return (
						<OptionEventSheetItemCard
							key={`${car.typ ?? "car"}-${index}`}
							icon={car.typ ? CAR_ICONS[car.typ] : Car}
							title={title}
							badgeCount={car.pax}
							badgeLabel={
								car.pax != null ? sheetTexts.pax : undefined
							}
							description={car.description}
						/>
					);
				})}
			</div>
		</div>
	);
};
