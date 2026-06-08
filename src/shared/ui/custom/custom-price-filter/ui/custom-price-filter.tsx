"use client";

import { type FC, useCallback, useState } from "react";

import { Input, Slider } from "@/shared/ui";

export interface IPriceRange {
	from: number;
	to: number;
}

interface ICustomPriceFilterProps {
	min?: number;
	max?: number;
	from?: number;
	to?: number;
	onValueChange?: (value: IPriceRange) => void;
	onChange?: (value: IPriceRange) => void;
}

export const CustomPriceFilter: FC<ICustomPriceFilterProps> = ({
	min = 0,
	max = 3000,
	from,
	to,
	onValueChange,
	onChange
}) => {
	const [localValue, setLocalValue] = useState<IPriceRange>({
		from: from ?? min,
		to: to ?? max
	});
	const [prevFrom, setPrevFrom] = useState(from);
	const [prevTo, setPrevTo] = useState(to);
	const [prevMin, setPrevMin] = useState(min);
	const [prevMax, setPrevMax] = useState(max);

	if (
		from !== prevFrom ||
		to !== prevTo ||
		min !== prevMin ||
		max !== prevMax
	) {
		setPrevFrom(from);
		setPrevTo(to);
		setPrevMin(min);
		setPrevMax(max);
		setLocalValue({
			from: from ?? min,
			to: to ?? max
		});
	}

	const handleSliderChange = useCallback(
		(val: number[]) => {
			const newValue: IPriceRange = { from: val[0], to: val[1] };
			setLocalValue(newValue);
			onValueChange?.(newValue);
		},
		[onValueChange]
	);

	const handleSliderCommit = useCallback(
		(val: number[]) => {
			const newValue: IPriceRange = { from: val[0], to: val[1] };
			onChange?.(newValue);
		},
		[onChange]
	);

	const handleInputChange = useCallback(
		(field: keyof IPriceRange, val: string) => {
			const numVal = Number(val);
			if (isNaN(numVal)) return;

			setLocalValue((prev) => {
				const newValue = { ...prev, [field]: numVal };
				onValueChange?.(newValue);
				return newValue;
			});
		},
		[onValueChange]
	);

	const handleInputBlur = useCallback(() => {
		onChange?.(localValue);
	}, [onChange, localValue]);

	return (
		<div className="space-y-4">
			<Slider
				min={min}
				max={max}
				step={10}
				value={[localValue.from, localValue.to]}
				onValueChange={handleSliderChange}
				onValueCommit={handleSliderCommit}
				className="py-4"
			/>

			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<Input
						type="number"
						value={localValue.from}
						onChange={(e) =>
							handleInputChange("from", e.target.value)
						}
						onBlur={handleInputBlur}
						className="h-9 pr-3 text-sm"
					/>
				</div>
				<div className="relative flex-1">
					<Input
						type="number"
						value={localValue.to}
						onChange={(e) =>
							handleInputChange("to", e.target.value)
						}
						onBlur={handleInputBlur}
						className="h-9 pr-3 text-sm"
					/>
				</div>
			</div>
		</div>
	);
};
