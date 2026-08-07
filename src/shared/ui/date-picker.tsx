"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { useUiContent } from "@/shared/ui-content";
import { Button } from "@/shared/ui/shadcn-ui/button";
import { Calendar } from "@/shared/ui/shadcn-ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui/shadcn-ui/popover";

interface IDatePickerProps {
	from?: Date;
	to?: Date;
	onChange?: (date: { from?: Date; to?: Date }) => void;
}

export const DatePicker = ({ from, to, onChange }: IDatePickerProps) => {
	const { common } = useUiContent();
	const datePicker = common.datePicker;
	const defaultDate: DateRange = {
		from: from,
		to: to
	};

	const [date, setDate] = useState<DateRange | undefined>(defaultDate);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [prevFrom, setPrevFrom] = useState(from);
	const [prevTo, setPrevTo] = useState(to);

	if (from !== prevFrom || to !== prevTo) {
		setPrevFrom(from);
		setPrevTo(to);
		setDate({ from, to });
	}

	const handleApply = () => {
		if (date) {
			onChange?.({ from: date.from, to: date.to });
		}
		setIsPopoverOpen(false);
	};

	const handleReset = () => {
		const empty = { from: undefined, to: undefined };
		setDate(empty);
		onChange?.(empty);
		setIsPopoverOpen(false);
	};

	const handleSelect = (selected: DateRange | undefined) => {
		setDate({
			from: selected?.from || undefined,
			to: selected?.to || undefined
		});
	};

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<Button type="button" variant="outline" className="w-[350px]">
					<CalendarIcon />
					{date?.from ? (
						date.to ? (
							<>
								{date?.from.toLocaleDateString()} -{" "}
								{date?.to.toLocaleDateString()}
							</>
						) : (
							date?.from.toLocaleDateString()
						)
					) : (
						<span>{datePicker.placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					autoFocus
					mode="range"
					defaultMonth={date?.from}
					showOutsideDays={false}
					selected={date}
					onSelect={handleSelect}
					numberOfMonths={2}
				/>
				<div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
					<Button variant="outline" onClick={handleReset}>
						{datePicker.buttons.reset}
					</Button>
					<Button onClick={handleApply}>
						{datePicker.buttons.apply}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
