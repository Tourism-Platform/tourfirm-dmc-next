import { Loader2Icon, type LucideIcon, MapPin } from "lucide-react";
import {
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

import { cn } from "@/shared/lib";
import type {
	IGeoSelectOption,
	TGeoFormValue
} from "@/shared/types/geo-form.types";
import {
	Input,
	Popover,
	PopoverAnchor,
	PopoverContent,
	ScrollArea
} from "@/shared/ui";
import { encodeGeoOptionValue } from "@/shared/utils/geo-option.utils";

export interface CustomGeoSelectProps {
	options: IGeoSelectOption[];
	value?: TGeoFormValue | null;
	onChange: (value: TGeoFormValue | null) => void;
	onQueryChange: (query: string) => void;
	isLoading?: boolean;
	minQueryLength?: number;
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	icon?: LucideIcon;
}

export const CustomGeoSelect: FC<CustomGeoSelectProps> = ({
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
	icon: Icon = MapPin
}) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const anchorRef = useRef<HTMLDivElement>(null);
	const [popoverWidth, setPopoverWidth] = useState<number>();

	const selectedValueKey = useMemo(
		() => (value ? encodeGeoOptionValue(value.lat, value.long) : undefined),
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

	const handleSelect = (feature: TGeoFormValue) => {
		onChange(feature);
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
					<Icon className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-primary opacity-50" />
					<Input
						value={displayValue}
						placeholder={placeholder}
						disabled={disabled}
						className="ps-9"
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
				className="p-1"
				align="start"
				style={popoverWidth ? { width: popoverWidth } : undefined}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				{isLoading ? (
					<div className="flex items-center justify-center py-6">
						<Loader2Icon className="size-5 animate-spin" />
					</div>
				) : null}
				{showEmpty ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						{emptyText}
					</p>
				) : null}
				{showOptions ? (
					<ScrollArea className="h-60 w-full">
						<ul className="flex flex-col gap-0.5 p-0.5 pr-3">
							{options.map((option) => (
								<li key={option.value}>
									<button
										type="button"
										className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() =>
											handleSelect(option.feature)
										}
									>
										{option.label}
									</button>
								</li>
							))}
						</ul>
					</ScrollArea>
				) : null}
			</PopoverContent>
		</Popover>
	);
};
