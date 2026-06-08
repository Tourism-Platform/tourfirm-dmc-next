import { type LucideIcon } from "lucide-react";
import { type FC, useState } from "react";

import { cn } from "@/shared/lib";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui";

export interface CustomAutocompleteOption {
	label: string;
	value: string;
}

export interface CustomAutocompleteProps {
	options: CustomAutocompleteOption[];
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	icon?: LucideIcon;
}

export const CustomAutocomplete: FC<CustomAutocompleteProps> = ({
	options,
	value,
	onChange,
	placeholder = "Select option...",
	emptyText = "No results found.",
	disabled,
	className,
	icon
}) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const selectedOption = options.find((option) => option.value === value);

	// Текст в инпуте: когда открыто — то, что вводим, иначе — лейбл выбранного значения
	const displayValue = open ? searchValue : (selectedOption?.label ?? "");

	return (
		<div className={cn("w-full", className)}>
			<Command className="overflow-visible">
				<Popover
					open={open}
					onOpenChange={(isOpen) => {
						if (isOpen) setSearchValue(selectedOption?.label ?? "");
						setOpen(isOpen);
					}}
					modal
				>
					<PopoverTrigger asChild>
						<div className="w-full">
							<CommandInput
								icon={icon}
								placeholder={placeholder}
								value={displayValue}
								onValueChange={(val) => {
									setSearchValue(val);
									if (val === "") {
										onChange("");
									}
									if (!open && val) setOpen(true);
								}}
								className="text-primary"
								disabled={disabled}
							/>
						</div>
					</PopoverTrigger>
					<PopoverContent
						style={{ width: "var(--radix-popover-trigger-width)" }}
						className="p-1"
						align="start"
						onOpenAutoFocus={(e) => e.preventDefault()}
					>
						<CommandList>
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup className="p-0">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.label}
										onSelect={() => {
											onChange(option.value);
											setSearchValue(""); // Очищаем поиск после выбора
											setOpen(false);
										}}
									>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</PopoverContent>
				</Popover>
			</Command>
		</div>
	);
};
