"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui";

export interface SelectPickerOption {
	label: string;
	value: string;
}

export interface SelectPickerProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	options: SelectPickerOption[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export const SelectPicker = React.forwardRef<
	HTMLButtonElement,
	SelectPickerProps
>(
	(
		{
			value,
			defaultValue,
			onChange,
			options,
			placeholder,
			className,
			disabled,
			...props
		},
		ref
	) => {
		return (
			<Select
				onValueChange={onChange}
				defaultValue={defaultValue}
				value={value}
				disabled={disabled}
			>
				<SelectTrigger
					ref={ref}
					className={cn("w-full", className)}
					{...props}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}
);

SelectPicker.displayName = "SelectPicker";
