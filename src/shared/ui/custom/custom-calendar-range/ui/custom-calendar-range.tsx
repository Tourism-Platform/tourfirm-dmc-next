import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { type FC, useState } from "react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/shared/lib";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

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
						"flex items-center gap-2 cursor-pointer rounded-md py-1 px-3 h-9 justify-start",
						className
					)}
				>
					<CalendarIcon className="w-4 h-4 text-primary " />
					<span
						className={cn(
							"text-sm font-medium text-muted-foreground leading-tight",
							!!value?.from && "text-primary"
						)}
					>
						{formatDateRange(value)}
					</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className="flex justify-center"
				align="center"
				style={{ width: "var(--radix-popover-trigger-width)" }}
			>
				<Calendar
					mode="range"
					locale={currentLocale}
					defaultMonth={value?.from}
					selected={value ?? undefined}
					onSelect={onChange}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	);
};
