"use client";

import { Loader2, type LucideIcon, MapPin } from "lucide-react";
import {
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

import { cn } from "@/shared/lib/utils";
import {
	Input,
	Popover,
	PopoverAnchor,
	PopoverContent,
	ScrollArea
} from "@/shared/ui";

import {
	LOCATION_SUGGEST_KIND_ICONS,
	LOCATION_SUGGEST_KIND_LABELS,
	getLocationSuggestKindBadgeClass
} from "../config";
import { encodeLocationSuggestValue } from "../converters/location-suggest.converters";
import type { TLocationSuggestFormValue } from "../schema/search-tours.schema";
import type {
	ENUM_LOCATION_SUGGEST_KIND_TYPE,
	TLocationSuggestOption
} from "../types";

const INPUT_ICON_CLASS =
	"pointer-events-none absolute top-1/2 start-3 size-5 -translate-y-1/2 text-primary opacity-50";

function LocationKindIcon({
	kind,
	fallback: Fallback = MapPin,
	className
}: {
	kind?: ENUM_LOCATION_SUGGEST_KIND_TYPE;
	fallback?: LucideIcon;
	className?: string;
}) {
	const Icon = kind ? LOCATION_SUGGEST_KIND_ICONS[kind] : Fallback;

	return <Icon className={className} />;
}

export interface ILocationSuggestSelectProps {
	options: TLocationSuggestOption[];
	value?: TLocationSuggestFormValue | null;
	onChange: (value: TLocationSuggestFormValue | null) => void;
	onQueryChange: (query: string) => void;
	isLoading?: boolean;
	minQueryLength?: number;
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	icon?: LucideIcon;
}

export const LocationSuggestSelect: FC<ILocationSuggestSelectProps> = ({
	options,
	value,
	onChange,
	onQueryChange,
	isLoading = false,
	minQueryLength = 2,
	placeholder = "Search location...",
	emptyText = "No results found.",
	disabled,
	className,
	icon: DefaultIcon = MapPin
}) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const anchorRef = useRef<HTMLDivElement>(null);
	const [popoverWidth, setPopoverWidth] = useState<number>();

	const selectedValueKey = useMemo(
		() =>
			value
				? encodeLocationSuggestValue(value.kind, value.value)
				: undefined,
		[value]
	);

	const selectedOption = useMemo(
		() => options.find((option) => option.value === selectedValueKey),
		[options, selectedValueKey]
	);

	const closedDisplayValue = value?.label ?? selectedOption?.label ?? "";
	const displayValue = open ? searchValue : closedDisplayValue;

	const showEmpty =
		!isLoading &&
		searchValue.trim().length >= minQueryLength &&
		options.length === 0;

	const showOptions = !isLoading && options.length > 0;

	const updatePopoverWidth = useCallback(() => {
		if (anchorRef.current) {
			setPopoverWidth(anchorRef.current.offsetWidth);
		}
	}, []);

	useEffect(() => {
		if (open) {
			updatePopoverWidth();
		}
	}, [open, updatePopoverWidth]);

	const handleInputChange = (val: string) => {
		setSearchValue(val);
		onQueryChange(val);

		if (val === "") {
			onChange(null);
			return;
		}

		if (!open) {
			setOpen(true);
		}
	};

	const handleSelect = (option: TLocationSuggestOption) => {
		onChange(option.suggestion);
		setSearchValue("");
		onQueryChange("");
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverAnchor asChild>
				<div
					ref={anchorRef}
					className={cn("relative w-full", className)}
				>
					<LocationKindIcon
						kind={value?.kind}
						fallback={DefaultIcon}
						className={INPUT_ICON_CLASS}
					/>
					<Input
						value={displayValue}
						placeholder={placeholder}
						disabled={disabled}
						className="ps-10 text-base"
						onFocus={() => {
							setSearchValue(closedDisplayValue);
							setOpen(true);
						}}
						onBlur={() => {
							window.setTimeout(() => setOpen(false), 150);
						}}
						onChange={(event) =>
							handleInputChange(event.target.value)
						}
					/>
				</div>
			</PopoverAnchor>
			<PopoverContent
				className="p-2"
				align="start"
				style={popoverWidth ? { width: popoverWidth } : undefined}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				{isLoading ? (
					<div className="flex items-center justify-center py-6">
						<Loader2 className="size-5 animate-spin" />
					</div>
				) : null}
				{showEmpty ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						{emptyText}
					</p>
				) : null}
				{showOptions ? (
					<ScrollArea className="h-64 w-full">
						<ul className="flex flex-col gap-1.5 p-0.5 pr-2">
							{options.map((option) => {
								const kind = option.suggestion.kind;

								return (
									<li key={option.value}>
										<button
											type="button"
											className="flex w-full items-center gap-3.5 rounded-md px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
											onMouseDown={(e) =>
												e.preventDefault()
											}
											onClick={() => handleSelect(option)}
										>
											<span
												className={cn(
													"flex size-11 shrink-0 items-center justify-center rounded-lg",
													getLocationSuggestKindBadgeClass(
														kind
													)
												)}
											>
												<LocationKindIcon
													kind={kind}
													className="size-5"
												/>
											</span>
											<span className="min-w-0 flex-1">
												<span className="block truncate text-base font-medium leading-snug">
													{option.label}
												</span>
												<span className="block truncate text-sm text-muted-foreground">
													{
														LOCATION_SUGGEST_KIND_LABELS[
															kind
														]
													}
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ul>
					</ScrollArea>
				) : null}
			</PopoverContent>
		</Popover>
	);
};
