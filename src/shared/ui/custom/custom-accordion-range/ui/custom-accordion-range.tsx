"use client";

import {
	type FC,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer
} from "recharts";

import { cn } from "@/shared/lib";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/shared/ui";

import { CustomPriceFilter } from "../../custom-price-filter";

import { CustomAccordionRangeSkeleton } from "./custom-accordion-range-skeleton";

interface IPriceRange {
	from: number;
	to: number;
}

interface ICustomAccordionRangeProps {
	id: string;
	title: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	min: number;
	max: number;
	from?: number;
	to?: number;
	step?: number;
	useHistogram?: boolean;
	histogramData?: { range: string; count: number }[];
	isLoading?: boolean;
	onChange: (value: IPriceRange) => void;
	className?: string;
}

export const CustomAccordionRange: FC<ICustomAccordionRangeProps> = memo(
	({
		id,
		title,
		icon: Icon,
		min,
		max,
		from = 0,
		to = 3000,
		step = 200,
		useHistogram,
		histogramData = [],
		isLoading,
		onChange,
		className
	}) => {
		const [localValue, setLocalValue] = useState<IPriceRange>({
			from: from ?? min,
			to: to ?? max
		});

		useEffect(() => {
			setLocalValue({
				from: from ?? min,
				to: to ?? max
			});
		}, [from, to, min, max]);

		const parsedHistogramData = useMemo(() => {
			return histogramData.map((item) => {
				const [start, end] = item.range.split("-").map(Number);
				return { ...item, start, end };
			});
		}, [histogramData]);

		const histogramColors = useMemo(() => {
			const filterStart = Math.floor(localValue.from / step) * step;
			const filterEnd = Math.ceil(localValue.to / step) * step;

			return parsedHistogramData.map((item) =>
				item.start >= filterStart && item.end <= filterEnd
					? "var(--primary)"
					: "var(--muted)"
			);
		}, [parsedHistogramData, localValue, step]);

		const handleLiveSliderChange = useCallback((newValue: IPriceRange) => {
			setLocalValue(newValue);
		}, []);

		const handleSliderCommit = useCallback(
			(newValue: IPriceRange) => {
				setLocalValue(newValue);
				onChange(newValue);
			},
			[onChange]
		);

		return (
			<Accordion
				type="single"
				collapsible
				defaultValue={id}
				className={cn("w-full", className)}
			>
				<AccordionItem value={id} className="grid gap-3 border-none">
					<AccordionTrigger className="py-2 hover:no-underline">
						<div className="text-foreground flex items-center gap-2 font-semibold">
							{Icon && <Icon className="text-primary h-5 w-5" />}
							<span>{title}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-4">
						<div className="flex flex-col gap-4 px-1">
							{useHistogram && isLoading && (
								<CustomAccordionRangeSkeleton
									count={(to - from) / step}
								/>
							)}

							{useHistogram &&
								!isLoading &&
								histogramData.length > 0 && (
									<div className="h-[100px] w-full">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<BarChart
												accessibilityLayer
												data={histogramData}
											>
												<CartesianGrid
													vertical={false}
												/>
												<Bar dataKey="count" radius={4}>
													{histogramData.map(
														(_, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	histogramColors[
																		index
																	]
																}
															/>
														)
													)}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</div>
								)}

							<CustomPriceFilter
								min={min}
								max={max}
								from={localValue.from}
								to={localValue.to}
								onValueChange={handleLiveSliderChange}
								onChange={handleSliderCommit}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
	}
);

CustomAccordionRange.displayName = "CustomAccordionRange";
