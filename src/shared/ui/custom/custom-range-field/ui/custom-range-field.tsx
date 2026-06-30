"use client";

import { type FC, useId } from "react";
import type { Control } from "react-hook-form";

import type { TTranslateFn } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from "@/shared/ui";

export interface ICustomRangeFieldProps {
	control: Control<any>;
	name: string;
	label: string;
	t: TTranslateFn;
	placeholder_left?: string;
	placeholder_right?: string;
	className?: string;
}

export const CustomRangeField: FC<ICustomRangeFieldProps> = ({
	control,
	name,
	label,
	t,
	placeholder_left,
	placeholder_right,
	className
}) => {
	const id = useId();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value = field.value || { from: "", to: "" };
				const errors = fieldState.error as any;

				return (
					<FormItem className={cn("relative mb-5", className)}>
						<FormLabel className="ml-1">{t(label)}:</FormLabel>
						<FormControl>
							<div className="flex">
								<Input
									aria-label="From"
									className={cn(
										"flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
										errors?.from &&
											"border-destructive focus-visible:ring-destructive"
									)}
									id={`${id}-from`}
									placeholder={
										placeholder_left
											? t(placeholder_left)
											: ""
									}
									type="number"
									value={value.from}
									onChange={(e) =>
										field.onChange({
											...value,
											from: e.target.valueAsNumber || ""
										})
									}
								/>
								<Input
									aria-label="To"
									className={cn(
										"-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
										errors?.to &&
											"border-destructive focus-visible:ring-destructive"
									)}
									id={`${id}-to`}
									placeholder={
										placeholder_right
											? t(placeholder_right)
											: ""
									}
									type="number"
									value={value.to}
									onChange={(e) =>
										field.onChange({
											...value,
											to: e.target.valueAsNumber || ""
										})
									}
								/>
							</div>
						</FormControl>
						{(errors?.from || errors?.to) && (
							<div className="absolute bottom-[-20px] left-1 text-[0.8rem] font-medium text-destructive grid grid-cols-2 gap-2 w-full">
								<span>
									{errors?.from && t(errors.from.message)}
								</span>
								<span>
									{errors?.to && t(errors.to.message)}
								</span>
							</div>
						)}
						{!errors?.from && !errors?.to && (
							<FormMessage
								t={t}
								className="absolute bottom-[-20px] left-1"
							/>
						)}
					</FormItem>
				);
			}}
		/>
	);
};
