import { forwardRef } from "react";
import {
	Label,
	TimeField,
	type TimeFieldProps,
	type TimeValue
} from "react-aria-components";

import { DateInput } from "@/shared/ui";

export type TimePickerInputProps = TimeFieldProps<TimeValue> & {
	"aria-invalid"?: boolean | "true" | "false";
};

export const TimePickerInput = forwardRef<HTMLDivElement, TimePickerInputProps>(
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
			<TimeField
				ref={ref}
				{...props}
				value={value ?? null}
				isInvalid={isInvalid}
			>
				<Label className="sr-only">{ariaLabel || "Time"}</Label>
				<DateInput />
			</TimeField>
		);
	}
);

TimePickerInput.displayName = "TimePickerInput";
