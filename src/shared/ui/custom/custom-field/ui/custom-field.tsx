"use client";

import { parseDate, parseTime } from "@internationalized/date";
import type { ComponentProps, FC } from "react";
import type { DateValue, TimeValue } from "react-aria-components";
import type { Control } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import {
	CustomAutocomplete,
	type CustomAutocompleteProps
} from "@/shared/ui/custom/custom-autocomplete";
import { CustomCalendarRange } from "@/shared/ui/custom/custom-calendar-range";
import {
	CustomCountrySelect,
	type CustomCountrySelectProps
} from "@/shared/ui/custom/custom-country-select";
import {
	CustomGeoSelect,
	type CustomGeoSelectProps
} from "@/shared/ui/custom/custom-geo-select";
import {
	CustomUploadFilesField,
	type ICustomUploadFilesProps
} from "@/shared/ui/custom/custom-upload-files";
import { DatePicker } from "@/shared/ui/date-picker";
import type { BadgeSize, BadgeVariant } from "@/shared/ui/shadcn-ui/badge";
import {
	DatePickerInput,
	type DatePickerInputProps
} from "@/shared/ui/shadcn-ui/date-picker-input";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/shared/ui/shadcn-ui/form";
import { Input } from "@/shared/ui/shadcn-ui/input";
import {
	MultipleSelector,
	type MultipleSelectorDisplayMode,
	type Option as MultipleSelectorOption
} from "@/shared/ui/shadcn-ui/multiselect";
import { PasswordInput } from "@/shared/ui/shadcn-ui/password-input";
import { PhoneInput } from "@/shared/ui/shadcn-ui/phone-input";
import {
	SelectPicker,
	type SelectPickerProps
} from "@/shared/ui/shadcn-ui/select-picker";
import { Switch } from "@/shared/ui/shadcn-ui/switch";
import { Textarea } from "@/shared/ui/shadcn-ui/textarea";
import {
	TimePickerInput,
	type TimePickerInputProps
} from "@/shared/ui/shadcn-ui/time-picker-input";

export type CustomFieldVariant =
	| "input"
	| "password"
	| "phone"
	| "textarea"
	| "time"
	| "date"
	| "select"
	| "multiselect"
	| "upload"
	| "autocomplete"
	| "country"
	| "geo"
	| "dateRange"
	| "datePicker"
	| "switch";

type BaseFieldProps = {
	control: Control<any>;
	name: string;
	label?: string;
	t: any;
	className?: string;
	disabled?: boolean;
	externalError?: string;
	hideLabel?: boolean;
};

type TextFieldVariant = BaseFieldProps & {
	fieldType?: Extract<CustomFieldVariant, "input">;
} & React.ComponentProps<"input">;

type PasswordFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "password">;
} & Omit<ComponentProps<typeof Input>, "type">;

type PhoneFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "phone">;
} & Omit<ComponentProps<typeof Input>, "type">;

type TextareaFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "textarea">;
	placeholder: string;
	rows?: number;
};

type TimeFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "time">;
} & TimePickerInputProps;

type DateFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "date">;
} & DatePickerInputProps;

type SelectFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "select">;
} & SelectPickerProps;

type MultiselectFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "multiselect">;
	options: MultipleSelectorOption[];
	placeholder?: string;
	displayMode?: MultipleSelectorDisplayMode;
	badgeVariant?: BadgeVariant;
	badgeSize?: BadgeSize;
	hideClearAllButton?: boolean;
};

type AutocompleteFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "autocomplete">;
} & Omit<CustomAutocompleteProps, "value" | "onChange">;

type CountryFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "country">;
} & Omit<CustomCountrySelectProps, "value" | "onChange">;

type UploadFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "upload">;
} & ICustomUploadFilesProps;

type GeoFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "geo">;
} & Omit<CustomGeoSelectProps, "value" | "onChange">;

type DateRangeFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "dateRange">;
	placeholder?: string;
};

type DatePickerFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "datePicker">;
};

type SwitchFieldVariant = BaseFieldProps & {
	fieldType: Extract<CustomFieldVariant, "switch">;
	description?: string;
};

type CustomFieldProps =
	| TextFieldVariant
	| PasswordFieldVariant
	| PhoneFieldVariant
	| TextareaFieldVariant
	| TimeFieldVariant
	| DateFieldVariant
	| SelectFieldVariant
	| MultiselectFieldVariant
	| UploadFieldVariant
	| AutocompleteFieldVariant
	| CountryFieldVariant
	| GeoFieldVariant
	| DateRangeFieldVariant
	| DatePickerFieldVariant
	| SwitchFieldVariant;

// helpers
const toDateValue = (v: unknown): DateValue | null => {
	if (!v || typeof v !== "string") return null;
	try {
		return parseDate(v);
	} catch {
		return null;
	}
};

const toTimeValue = (v: unknown): TimeValue | null => {
	if (!v || typeof v !== "string") return null;
	try {
		return parseTime(v);
	} catch {
		return null;
	}
};

export const CustomField: FC<CustomFieldProps> = (props) => {
	const {
		control,
		name,
		label,
		t,
		className,
		fieldType,
		externalError,
		hideLabel,
		...rest
	} = props;

	const resolveText = (key?: string): string | undefined =>
		key ? t(key) : undefined;

	const renderInput = (field: any) => {
		switch (fieldType) {
			case "input":
				return (
					<Input
						{...rest}
						placeholder={resolveText(props.placeholder)}
						{...field}
						onChange={(event) => {
							if (props.type === "number") {
								const value = event.target.valueAsNumber;
								field.onChange(
									Number.isFinite(value) ? value : null
								);
							} else {
								field.onChange(event);
							}
						}}
					/>
				);
			case "password":
				return (
					<PasswordInput
						{...rest}
						placeholder={resolveText(props.placeholder)}
						{...field}
					/>
				);
			case "phone":
				return (
					<PhoneInput
						{...rest}
						international
						placeholder={resolveText(props.placeholder)}
						{...field}
					/>
				);
			case "textarea":
				return (
					<Textarea
						{...rest}
						className="resize-none h-32"
						placeholder={resolveText(props.placeholder)}
						{...field}
					/>
				);
			case "time": {
				const timeRest = rest as Omit<
					TimePickerInputProps,
					"defaultValue"
				>;

				return (
					<TimePickerInput
						{...timeRest}
						aria-label={label ? t(label) : undefined}
						hourCycle={24}
						value={toTimeValue(field.value)}
						onChange={(val) =>
							field.onChange(val?.toString() ?? null)
						}
						onBlur={field.onBlur}
					/>
				);
			}

			case "date": {
				const dateRest = rest as Omit<
					DatePickerInputProps,
					"defaultValue"
				>;

				return (
					<DatePickerInput
						{...dateRest}
						aria-label={label ? t(label) : undefined}
						value={toDateValue(field.value)}
						onChange={(val) =>
							field.onChange(val?.toString() ?? null)
						}
						onBlur={field.onBlur}
					/>
				);
			}
			case "select":
				return (
					<SelectPicker
						{...rest}
						placeholder={resolveText(props.placeholder)}
						{...field}
					/>
				);
			case "multiselect":
				return (
					<MultipleSelector
						defaultOptions={props.options}
						placeholder={resolveText(props.placeholder)}
						value={props.options.filter(
							(opt: MultipleSelectorOption) =>
								(field.value || []).includes(opt.value)
						)}
						onChange={(options: MultipleSelectorOption[]) =>
							field.onChange(
								options.map(
									(opt: MultipleSelectorOption) => opt.value
								)
							)
						}
						displayMode={props.displayMode}
						badgeVariant={props.badgeVariant}
						badgeSize={props.badgeSize}
						hideClearAllButton={props.hideClearAllButton}
					/>
				);
			case "autocomplete":
				return (
					<CustomAutocomplete
						{...props}
						placeholder={resolveText(props.placeholder)}
						emptyText={resolveText(props.emptyText)}
						value={field.value}
						onChange={field.onChange}
					/>
				);
			case "upload":
				return (
					<CustomUploadFilesField
						{...props}
						readOnly={props.readOnly || props.disabled}
					/>
				);
			case "country":
				return (
					<CustomCountrySelect
						{...props}
						placeholder={resolveText(props.placeholder)}
						emptyText={resolveText(props.emptyText)}
						value={field.value ?? ""}
						onChange={field.onChange}
					/>
				);
			case "geo":
				return (
					<CustomGeoSelect
						{...props}
						placeholder={resolveText(props.placeholder)}
						emptyText={resolveText(props.emptyText)}
						value={field.value ?? null}
						onChange={field.onChange}
					/>
				);
			case "dateRange":
				return (
					<CustomCalendarRange
						{...props}
						placeholder={resolveText(props.placeholder)}
						{...field}
					/>
				);
			case "datePicker": {
				const value = field.value as
					| { from?: Date; to?: Date }
					| null
					| undefined;

				return (
					<DatePicker
						from={value?.from}
						to={value?.to}
						onChange={field.onChange}
					/>
				);
			}
			case "switch":
				return (
					<Switch
						checked={field.value}
						onCheckedChange={field.onChange}
						disabled={props.disabled}
					/>
				);

			default:
				return (
					<Input
						{...rest}
						placeholder={resolveText(props.placeholder)}
						{...field}
						onChange={(event) => {
							if (props.type === "number") {
								const value = event.target.valueAsNumber;
								field.onChange(
									Number.isFinite(value) ? value : null
								);
							} else {
								field.onChange(event);
							}
						}}
					/>
				);
		}
	};

	if (fieldType === "switch") {
		return (
			<FormField
				control={control}
				name={name}
				render={({ field }) => (
					<FormItem
						className={cn(
							"flex items-center justify-between gap-4",
							className
						)}
					>
						<FormLabel className="cursor-pointer">
							{t(label)}
						</FormLabel>
						<FormControl>{renderInput(field)}</FormControl>
					</FormItem>
				)}
			/>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn("relative", !hideLabel && "mb-5", className)}
				>
					{label && !hideLabel ? (
						<FormLabel className="ml-1">{t(label)}:</FormLabel>
					) : null}
					<FormControl>{renderInput(field)}</FormControl>
					<FormMessage
						t={t}
						className="absolute bottom-[-20px] left-1"
					>
						{externalError}
					</FormMessage>
				</FormItem>
			)}
		/>
	);
};
