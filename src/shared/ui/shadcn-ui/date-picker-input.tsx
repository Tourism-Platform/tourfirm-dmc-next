import { CalendarIcon } from "lucide-react";
import { forwardRef } from "react";
import {
	Button,
	DatePicker,
	type DatePickerProps,
	type DateValue,
	Dialog,
	Group,
	Label,
	Popover
} from "react-aria-components";

import { Calendar } from "@/shared/ui/shadcn-ui/calendar-rac";
import { DateInput } from "@/shared/ui/shadcn-ui/datefield-rac";

export type DatePickerInputProps = DatePickerProps<DateValue> & {
	"aria-invalid"?: boolean | "true" | "false";
};

export const DatePickerInput = forwardRef<HTMLDivElement, DatePickerInputProps>(
	(
		{
			"aria-label": ariaLabel,
			value,
			"aria-invalid": ariaInvalid,
			...props
		},
		ref
	) => {
		const isInvalid =
			props.isInvalid || ariaInvalid === true || ariaInvalid === "true";

		return (
			<DatePicker
				{...props}
				ref={ref}
				value={value ?? null}
				isInvalid={isInvalid}
			>
				<Label className="sr-only">{ariaLabel || "DatePicker"}</Label>

				<div className="flex">
					<Group className="w-full">
						<DateInput className="pe-9" />
					</Group>
					<Button className="cursor-pointer z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
						<CalendarIcon size={16} />
					</Button>
				</div>
				<Popover
					className="z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
					offset={4}
				>
					<Dialog className="max-h-[inherit] overflow-auto p-2">
						<Calendar />
					</Dialog>
				</Popover>
			</DatePicker>
		);
	}
);

DatePickerInput.displayName = "DatePickerInput";
