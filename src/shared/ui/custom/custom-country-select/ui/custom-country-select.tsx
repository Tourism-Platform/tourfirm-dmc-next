"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { type FC, useMemo, useRef, useState } from "react";
import type * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { type CountryCode, cn, getCountryOptions } from "@/shared/lib";
import { Button } from "@/shared/ui/shadcn-ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/shared/ui/shadcn-ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui/shadcn-ui/popover";
import { ScrollArea } from "@/shared/ui/shadcn-ui/scroll-area";

export type CustomCountrySelectProps = {
	value?: CountryCode;
	onChange: (value: CountryCode) => void;
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};

export const CustomCountrySelect: FC<CustomCountrySelectProps> = ({
	value = "",
	onChange,
	placeholder = "Select country...",
	emptyText = "No country found.",
	disabled,
	className
}) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	// Passport nationality is conventionally written in English
	const options = useMemo(() => getCountryOptions("en"), []);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<Popover
			open={open}
			modal
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) setSearchValue("");
			}}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-between font-normal",
						!selectedOption && "text-muted-foreground",
						className
					)}
				>
					<span className="flex min-w-0 items-center gap-2">
						{selectedOption ? (
							<>
								<FlagComponent
									country={
										selectedOption.value as RPNInput.Country
									}
									countryName={selectedOption.label}
								/>
								<span className="truncate">
									{selectedOption.label}
								</span>
							</>
						) : (
							<span className="truncate">{placeholder}</span>
						)}
					</span>
					<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] p-0"
				align="start"
			>
				<Command>
					<CommandInput
						value={searchValue}
						onValueChange={(next) => {
							setSearchValue(next);
							setTimeout(() => {
								const viewport =
									scrollAreaRef.current?.querySelector(
										"[data-radix-scroll-area-viewport]"
									);
								if (viewport) {
									viewport.scrollTop = 0;
								}
							}, 0);
						}}
						placeholder={placeholder}
					/>
					<CommandList>
						<ScrollArea ref={scrollAreaRef} className="h-72">
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.searchValue}
										className="gap-2"
										onSelect={() => {
											onChange(option.value);
											setOpen(false);
										}}
									>
										<FlagComponent
											country={
												option.value as RPNInput.Country
											}
											countryName={option.label}
										/>
										<span className="flex-1 text-sm">
											{option.label}
										</span>
										<span className="text-sm text-foreground/50">
											{option.value}
										</span>
										<CheckIcon
											className={cn(
												"ml-auto size-4",
												option.value === value
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
