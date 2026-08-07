"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { XIcon } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

import { useDebounce } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { formatUiText, useUiContent } from "@/shared/ui-content";
import {
	Badge,
	type BadgeSize,
	type BadgeVariant
} from "@/shared/ui/shadcn-ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/shared/ui/shadcn-ui/command";

export type MultipleSelectorDisplayMode = "default" | "counter" | "badge";

export interface Option {
	value: string;
	label: string;
	disable?: boolean;
	/** fixed option that can't be removed. */
	fixed?: boolean;
	/** Group the options by providing key. */
	[key: string]: string | boolean | undefined;
}
interface GroupOption {
	[key: string]: Option[];
}

interface MultipleSelectorProps {
	value?: Option[];
	defaultOptions?: Option[];
	/** manually controlled options */
	options?: Option[];
	placeholder?: string;
	/** Loading component. */
	loadingIndicator?: React.ReactNode;
	/** Empty component. */
	emptyIndicator?: React.ReactNode;
	/** Debounce time for async search. Only work with `onSearch`. */
	delay?: number;
	/**
	 * Only work with `onSearch` prop. Trigger search when `onFocus`.
	 * For example, when user click on the input, it will trigger the search to get initial options.
	 **/
	triggerSearchOnFocus?: boolean;
	/** async search */
	onSearch?: (value: string) => Promise<Option[]>;
	/**
	 * sync search. This search will not showing loadingIndicator.
	 * The rest props are the same as async search.
	 * i.e.: creatable, groupBy, delay.
	 **/
	onSearchSync?: (value: string) => Option[];
	onChange?: (options: Option[]) => void;
	/** Limit the maximum number of selected options. */
	maxSelected?: number;
	/** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
	onMaxSelected?: (maxLimit: number) => void;
	/** Hide the placeholder when there are options selected. */
	hidePlaceholderWhenSelected?: boolean;
	disabled?: boolean;
	/** Group the options base on provided key. */
	groupBy?: string;
	className?: string;
	/**
	 * First item selected is a default behavior by cmdk. That is why the default is true.
	 * This is a workaround solution by add a dummy item.
	 *
	 * @reference: https://github.com/pacocoursey/cmdk/issues/171
	 */
	selectFirstItem?: boolean;
	/** Allow user to create option when there is no option matched. */
	creatable?: boolean;
	/** Props of `Command` */
	commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
	/** Props of `CommandInput` */
	inputProps?: Omit<
		React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
		"value" | "placeholder" | "disabled"
	>;
	/** hide the clear all button. */
	hideClearAllButton?: boolean;
	/** Display mode for selected items: default (badges in input), counter (X of Y), badge (counter + badges below) */
	displayMode?: MultipleSelectorDisplayMode;
	/** Badge variant for badge display mode */
	badgeVariant?: BadgeVariant;
	badgeSize?: BadgeSize;
	/** aria-invalid for form validation */
	"aria-invalid"?: boolean;
}

export interface MultipleSelectorRef {
	selectedValue: Option[];
	input: HTMLInputElement;
	focus: () => void;
	reset: () => void;
}

function transToGroupOption(options: Option[], groupBy?: string) {
	if (options.length === 0) {
		return {};
	}
	if (!groupBy) {
		return {
			"": options
		};
	}

	const groupOption: GroupOption = {};
	options.forEach((option) => {
		const key = (option[groupBy] as string) || "";
		if (!groupOption[key]) {
			groupOption[key] = [];
		}
		groupOption[key].push(option);
	});
	return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
	const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

	for (const [key, value] of Object.entries(cloneOption)) {
		cloneOption[key] = value.filter(
			(val) => !picked.find((p) => p.value === val.value)
		);
	}
	return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
	for (const [, value] of Object.entries(groupOption)) {
		if (
			value.some((option) =>
				targetOption.find((p) => p.value === option.value)
			)
		) {
			return true;
		}
	}
	return false;
}

const CommandEmpty = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	const render = useCommandState((state) => state.filtered.count === 0);

	if (!render) return null;

	return (
		<div
			className={cn("px-2 py-4 text-center text-sm", className)}
			role="presentation"
			{...props}
		/>
	);
};

CommandEmpty.displayName = "CommandEmpty";

export const MultipleSelector = ({
	value,
	onChange,
	placeholder,
	defaultOptions: arrayDefaultOptions = [],
	options: arrayOptions,
	delay,
	onSearch,
	onSearchSync,
	loadingIndicator,
	emptyIndicator,
	maxSelected = Number.MAX_SAFE_INTEGER,
	onMaxSelected,
	hidePlaceholderWhenSelected,
	disabled,
	groupBy,
	className,
	selectFirstItem = true,
	creatable = false,
	triggerSearchOnFocus = false,
	commandProps,
	inputProps,
	hideClearAllButton = false,
	displayMode = "default",
	badgeVariant,
	badgeSize,
	"aria-invalid": ariaInvalid
}: MultipleSelectorProps) => {
	const { common } = useUiContent();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [onScrollbar, setOnScrollbar] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	const [selected, setSelected] = React.useState<Option[]>(value || []);
	const [prevValue, setPrevValue] = React.useState(value);
	const [options, setOptions] = React.useState<GroupOption>(
		transToGroupOption(arrayDefaultOptions, groupBy)
	);
	const [inputValue, setInputValue] = React.useState("");
	const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

	if (value && value !== prevValue) {
		setPrevValue(value);
		setSelected(value);
	}

	const staticOptions = React.useMemo(
		() =>
			arrayOptions && !onSearch
				? transToGroupOption(arrayOptions, groupBy)
				: null,
		[arrayOptions, groupBy, onSearch]
	);

	const resolvedOptions = staticOptions ?? options;

	const totalOptions =
		arrayDefaultOptions.length || arrayOptions?.length || 0;
	const showBadgesInInput = displayMode === "default";

	const handleClickOutside = React.useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				inputRef.current.blur();
			}
		},
		[]
	);

	const handleUnselect = React.useCallback(
		(option: Option) => {
			const newOptions = selected.filter((s) => s.value !== option.value);
			setSelected(newOptions);
			onChange?.(newOptions);
		},
		[onChange, selected]
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "" && selected.length > 0) {
						const lastSelectOption = selected[selected.length - 1];
						// If last item is fixed, we should not remove it.
						if (!lastSelectOption.fixed) {
							handleUnselect(selected[selected.length - 1]);
						}
					}
				}
				// This is not a default behavior of the <input /> field
				if (e.key === "Escape") {
					input.blur();
				}
			}
		},
		[handleUnselect, selected]
	);

	useEffect(() => {
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchend", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		};
	}, [open, handleClickOutside]);

	useEffect(() => {
		/** sync search */

		const doSearchSync = () => {
			const res = onSearchSync?.(debouncedSearchTerm);
			setOptions(transToGroupOption(res || [], groupBy));
		};

		const exec = async () => {
			if (!onSearchSync || !open) return;

			if (triggerSearchOnFocus) {
				doSearchSync();
			}

			if (debouncedSearchTerm) {
				doSearchSync();
			}
		};

		void exec();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedSearchTerm,
		groupBy,
		open,
		triggerSearchOnFocus,
		onSearchSync
	]);

	useEffect(() => {
		/** async search */

		const doSearch = async () => {
			setIsLoading(true);
			const res = await onSearch?.(debouncedSearchTerm);
			setOptions(transToGroupOption(res || [], groupBy));
			setIsLoading(false);
		};

		const exec = async () => {
			if (!onSearch || !open) return;

			if (triggerSearchOnFocus) {
				await doSearch();
			}

			if (debouncedSearchTerm) {
				await doSearch();
			}
		};

		void exec();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearch]);

	const CreatableItem = () => {
		if (!creatable) return undefined;
		if (
			isOptionsExist(resolvedOptions, [
				{ label: inputValue, value: inputValue }
			]) ||
			selected.find((s) => s.value === inputValue)
		) {
			return undefined;
		}

		const Item = (
			<CommandItem
				className="cursor-pointer"
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onSelect={(value: string) => {
					if (selected.length >= maxSelected) {
						onMaxSelected?.(selected.length);
						return;
					}
					setInputValue("");
					const newOptions = [...selected, { label: value, value }];
					setSelected(newOptions);
					onChange?.(newOptions);
				}}
				value={inputValue}
			>
				{`Create "${inputValue}"`}
			</CommandItem>
		);

		// For normal creatable
		if (!onSearch && inputValue.length > 0) {
			return Item;
		}

		// For async search creatable. avoid showing creatable item before loading at first.
		if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
			return Item;
		}

		return undefined;
	};

	const EmptyItem = React.useCallback(() => {
		if (!emptyIndicator) return undefined;

		// For async search that showing emptyIndicator
		if (
			onSearch &&
			!creatable &&
			Object.keys(resolvedOptions).length === 0
		) {
			return (
				<CommandItem disabled value="-">
					{emptyIndicator}
				</CommandItem>
			);
		}

		return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
	}, [creatable, emptyIndicator, onSearch, resolvedOptions]);

	const selectables = React.useMemo<GroupOption>(
		() => removePickedOption(resolvedOptions, selected),
		[resolvedOptions, selected]
	);

	/** Avoid Creatable Selector freezing or lagging when paste a long string. */
	const commandFilter = React.useCallback(() => {
		if (commandProps?.filter) {
			return commandProps.filter;
		}

		if (creatable) {
			return (value: string, search: string) => {
				return value.toLowerCase().includes(search.toLowerCase())
					? 1
					: -1;
			};
		}
		// Using default filter in `cmdk`. We don&lsquo;t have to provide it.
		return undefined;
	}, [creatable, commandProps]);

	return (
		<Command
			ref={dropdownRef}
			{...commandProps}
			className={cn(
				"h-auto overflow-visible bg-transparent",
				commandProps?.className
			)}
			filter={commandFilter()}
			onKeyDown={(e) => {
				handleKeyDown(e);
				commandProps?.onKeyDown?.(e);
			}} // When onSearch is provided, we don&lsquo;t want to filter the options. You can still override it.
			shouldFilter={
				commandProps?.shouldFilter !== undefined
					? commandProps.shouldFilter
					: !onSearch
			}
		>
			{displayMode === "badge" && selected.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2">
					{selected.map((option) => (
						<Badge
							key={option.value}
							variant={badgeVariant}
							size={badgeSize}
							onClick={() => handleUnselect(option)}
							className="pl-3 pr-8 text-sm relative"
						>
							{option.label}
							{!option.fixed && (
								<button
									aria-label="Remove"
									className="flex items-center justify-center rounded-full text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 p-2"
									onClick={() => handleUnselect(option)}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									type="button"
								>
									<XIcon aria-hidden="true" size={12} />
								</button>
							)}
						</Badge>
					))}
				</div>
			)}
			<div
				className={cn(
					"relative min-h-[36px] rounded-md border border-input text-sm outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 cursor-text p-1",
					ariaInvalid &&
						"border-destructive ring-destructive/20 dark:ring-destructive/40",
					!hideClearAllButton && "pe-9",
					className
				)}
				aria-invalid={ariaInvalid}
				onClick={() => {
					if (disabled) return;
					inputRef?.current?.focus();
				}}
			>
				<div className="flex flex-wrap gap-1 items-stretch">
					{showBadgesInInput &&
						selected.map((option) => {
							return (
								<Badge
									key={option.value}
									variant={badgeVariant}
									size={badgeSize}
									onClick={() => handleUnselect(option)}
									className="pl-3 pr-8 text-sm relative"
								>
									{option.label}
									{!option.fixed && (
										<button
											aria-label="Remove"
											className="flex items-center justify-center rounded-full text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 p-2"
											onClick={() =>
												handleUnselect(option)
											}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											type="button"
										>
											<XIcon
												aria-hidden="true"
												size={12}
											/>
										</button>
									)}
								</Badge>
							);
						})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						{...inputProps}
						className={cn(
							"flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed px-2 py-0.5",
							hidePlaceholderWhenSelected && "w-full",
							inputProps?.className
						)}
						disabled={disabled}
						onBlur={(event) => {
							if (!onScrollbar) {
								setOpen(false);
							}
							inputProps?.onBlur?.(event);
						}}
						onFocus={(event) => {
							setOpen(true);
							if (triggerSearchOnFocus) {
								onSearch?.(debouncedSearchTerm);
							}
							inputProps?.onFocus?.(event);
						}}
						onValueChange={(value) => {
							setInputValue(value);
							inputProps?.onValueChange?.(value);
						}}
						placeholder={
							hidePlaceholderWhenSelected && selected.length !== 0
								? ""
								: displayMode !== "default" &&
									  selected.length > 0
									? formatUiText(
											common.multiselect.selected,
											{
												selected: selected.length,
												total: totalOptions
											}
										)
									: placeholder
						}
						ref={inputRef}
						value={inputValue}
					/>
					<button
						aria-label="Clear all"
						className={cn(
							"absolute end-0 top-0 flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
							(hideClearAllButton ||
								disabled ||
								selected.length < 1 ||
								selected.filter((s) => s.fixed).length ===
									selected.length) &&
								"hidden"
						)}
						onClick={() => {
							setSelected(selected.filter((s) => s.fixed));
							onChange?.(selected.filter((s) => s.fixed));
						}}
						type="button"
					>
						<XIcon aria-hidden="true" size={16} />
					</button>
				</div>
			</div>

			<div className="relative">
				<div
					className={cn(
						"absolute top-2 z-50 w-full overflow-hidden rounded-md border border-input",
						"data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
						!open && "hidden"
					)}
					data-state={open ? "open" : "closed"}
				>
					{open && (
						<CommandList
							className="bg-popover text-popover-foreground shadow-lg outline-hidden"
							onMouseEnter={() => {
								setOnScrollbar(true);
							}}
							onMouseLeave={() => {
								setOnScrollbar(false);
							}}
							onMouseUp={() => {
								inputRef?.current?.focus();
							}}
						>
							{isLoading ? (
								loadingIndicator
							) : (
								<>
									{EmptyItem()}
									{CreatableItem()}
									{!selectFirstItem && (
										<CommandItem
											className="hidden"
											value="-"
										/>
									)}
									{Object.entries(selectables).map(
										([key, dropdowns]) => (
											<CommandGroup
												className="h-full overflow-auto"
												heading={key}
												key={key}
											>
												{dropdowns.map((option) => {
													return (
														<CommandItem
															className={cn(
																"cursor-pointer",
																option.disable &&
																	"pointer-events-none cursor-not-allowed opacity-50"
															)}
															disabled={
																option.disable
															}
															key={option.value}
															onMouseDown={(
																e
															) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onSelect={() => {
																if (
																	selected.length >=
																	maxSelected
																) {
																	onMaxSelected?.(
																		selected.length
																	);
																	return;
																}
																setInputValue(
																	""
																);
																const newOptions =
																	[
																		...selected,
																		option
																	];
																setSelected(
																	newOptions
																);
																onChange?.(
																	newOptions
																);
															}}
															value={option.value}
														>
															{option.label}
														</CommandItem>
													);
												})}
											</CommandGroup>
										)
									)}
								</>
							)}
						</CommandList>
					)}
				</div>
			</div>
		</Command>
	);
};

// MultipleSelector.displayName = "MultipleSelector";
