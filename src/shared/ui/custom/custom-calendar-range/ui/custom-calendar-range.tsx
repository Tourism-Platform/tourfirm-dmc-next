"use client";

import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { type FC, useState } from "react";
import { type DateRange } from "react-day-picker";

import { useIsMobile } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Calendar } from "@/shared/ui/shadcn-ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui/shadcn-ui/popover";

const locales = {
	ru,
	en: enUS
};

interface CustomCalendarRangeProps {
	value?: DateRange | null;
	onChange: (value: DateRange | undefined) => void;
	placeholder?: string;
	className?: string;
}

export const CustomCalendarRange: FC<CustomCalendarRangeProps> = ({
	value,
	onChange,
	placeholder = "Select dates",
	className
}) => {
	const locale = useLocale();
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	const currentLocale = locales[locale as keyof typeof locales] || locales.en;

	const formatDateRange = (range: DateRange | undefined | null) => {
		if (!range?.from) return placeholder;
		if (!range.to)
			return format(range.from, "d MMM", { locale: currentLocale });
		return `${format(range.from, "d MMM", { locale: currentLocale })} - ${format(range.to, "d MMM", { locale: currentLocale })}`;
	};

	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<div
					className={cn(
						"border-input flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border bg-transparent px-3 py-1 shadow-xs outline-none",
						"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
						className
					)}
				>
					<CalendarIcon className="size-4 shrink-0 text-primary opacity-50" />
					<span
						className={cn(
							"text-sm font-medium leading-tight text-muted-foreground",
							!!value?.from && "text-foreground"
						)}
					>
						{formatDateRange(value)}
					</span>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="center">
				<Calendar
					mode="range"
					locale={currentLocale}
					defaultMonth={value?.from}
					selected={value ?? undefined}
					onSelect={onChange}
					numberOfMonths={isMobile ? 1 : 2}
				/>
			</PopoverContent>
		</Popover>
	);
};
