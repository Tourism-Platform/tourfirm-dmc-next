import { type FC, useId } from "react";
import type { Control } from "react-hook-form";

import type { TTranslateFn } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui";

export interface ICustomInputSelectOption {
	label: string;
	value: string;
}

export interface ICustomInputSelectProps {
	control: Control<any>;
	name: string;
	label: string;
	t: TTranslateFn;
	placeholder?: string;
	selectOptions: ICustomInputSelectOption[];
	defaultSelectValue?: string;
	className?: string;
	disabled?: boolean;
}

export const CustomInputSelect: FC<ICustomInputSelectProps> = ({
	control,
	name,
	label,
	t,
	placeholder,
	selectOptions,
	defaultSelectValue,
	className,
	disabled
}) => {
	const id = useId();
	const fallbackSelectValue =
		defaultSelectValue ?? selectOptions[0]?.value ?? "";

	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value = field.value || {
					value: "",
					typ: fallbackSelectValue
				};
				const errors = fieldState.error as any;

				return (
					<FormItem className={cn("relative mb-5", className)}>
						<FormLabel className="ml-1">{t(label)}:</FormLabel>
						<FormControl>
							<div className="flex">
								<Input
									id={`${id}-value`}
									type="number"
									disabled={disabled}
									className={cn(
										"flex-1 rounded-e-none focus:z-10",
										errors?.value &&
											"border-destructive focus-visible:ring-destructive"
									)}
									placeholder={
										placeholder ? t(placeholder) : ""
									}
									value={value.value ?? ""}
									onChange={(event) =>
										field.onChange({
											...value,
											value: event.target.value
										})
									}
								/>
								<Select
									value={value.typ ?? fallbackSelectValue}
									disabled={disabled}
									onValueChange={(typ) =>
										field.onChange({
											...value,
											typ
										})
									}
								>
									<SelectTrigger
										className={cn(
											"-ms-px w-[72px] shrink-0 rounded-s-none focus:z-10",
											errors?.typ &&
												"border-destructive focus-visible:ring-destructive"
										)}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="end">
										{selectOptions.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</FormControl>
						{(errors?.value || errors?.typ) && (
							<div className="absolute bottom-[-20px] left-1 grid w-full grid-cols-2 gap-2 text-[0.8rem] font-medium text-destructive">
								<span>
									{errors?.value && t(errors.value.message)}
								</span>
								<span>
									{errors?.typ && t(errors.typ.message)}
								</span>
							</div>
						)}
						{!errors?.value && !errors?.typ && (
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
