"use client";

import { Loader, type LucideIcon } from "lucide-react";
import { type FC, memo } from "react";

import { cn } from "@/shared/lib/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	Checkbox,
	Label,
	ScrollArea
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { type IAccordionItem } from "../model";

import { CustomAccordionSkeleton } from "./custom-accordion-skeleton";

interface ICustomAccordionProps {
	id: string;
	title: string;
	icon?: LucideIcon;
	items: IAccordionItem[];
	isLoading?: boolean;
	hasMore?: boolean;
	itemsLimit?: number;
	onChange: (id: string, checked: boolean) => void;
	onLoadMore?: () => void;
	className?: string;
}

export const CustomAccordion: FC<ICustomAccordionProps> = memo(
	({
		id,
		title,
		icon: Icon,
		items,
		isLoading,
		hasMore,
		itemsLimit,
		onChange,
		onLoadMore,
		className
	}) => {
		const { common } = useUiContent();
		const length = itemsLimit || items.length;
		return (
			<Accordion
				type="single"
				collapsible
				defaultValue={id}
				className={cn("w-full", className)}
			>
				<AccordionItem value={id} className="gap-3 grid">
					<AccordionTrigger className="py-2">
						<div className="flex items-center gap-2 font-semibold">
							{Icon && <Icon className="text-primary h-5" />}
							<span>{title}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<ScrollArea
							className={cn(
								"w-full",
								items.length > length || hasMore
									? "max-h-[var(--radix-scroll-area-height)]"
									: "h-auto"
							)}
							style={
								{
									"--radix-scroll-area-height": `${(length + 1) * 36}px`
								} as React.CSSProperties
							}
						>
							<div className="flex flex-col gap-3 pr-4">
								{isLoading && items.length === 0 ? (
									<CustomAccordionSkeleton count={5} />
								) : (
									items.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2">
												<Checkbox
													id={`${id}-${item.id}`}
													checked={item.checked}
													onCheckedChange={(
														checked
													) =>
														onChange(
															item.id,
															checked as boolean
														)
													}
												/>
												<Label
													htmlFor={`${id}-${item.id}`}
													className="cursor-pointer font-normal"
												>
													{item.label}
												</Label>
											</div>
											{!!item.value && (
												<span className="text-xs text-muted-foreground">
													{item.value}
												</span>
											)}
										</div>
									))
								)}

								{hasMore &&
									!(isLoading && items.length === 0) && (
										<Button
											variant="ghost"
											size="sm"
											className="h-auto p-0 text-xs text-muted-foreground mt-1 hover:bg-transparent"
											disabled={isLoading}
											onClick={(e) => {
												e.stopPropagation();
												onLoadMore?.();
											}}
										>
											{isLoading && (
												<Loader className="h-3 w-3 animate-spin mr-1" />
											)}
											{common.actions.showMore}
										</Button>
									)}
							</div>
						</ScrollArea>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
	}
);

CustomAccordion.displayName = "CustomAccordion";
