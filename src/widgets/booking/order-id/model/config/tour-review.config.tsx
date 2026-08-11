"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import type { TUiOrders } from "@/shared/ui-content";

import { type IOrderTourReviewItem } from "@/entities/booking";

import { EVENT_METADATA, FALLBACK_EVENT_ICON } from "./event-metadata";

export const TOUR_REVIEW_COLUMNS = (
	labels: TUiOrders["tourReview"]["table"]
): ColumnDef<IOrderTourReviewItem>[] => [
	{
		accessorKey: "item",
		header: labels.item,
		cell: ({
			row: {
				original: { type, subRows },
				depth,
				getIsExpanded,
				getToggleExpandedHandler
			},
			getValue
		}) => {
			const hasSubRows = !!subRows?.length;
			const metadata = type ? EVENT_METADATA[type] : null;
			const Icon = metadata?.icon ?? FALLBACK_EVENT_ICON;

			return (
				<div
					className="flex items-center gap-2"
					style={{ paddingLeft: `${depth * 2}rem` }}
				>
					{hasSubRows ? (
						<Button
							onClick={getToggleExpandedHandler()}
							variant="ghost"
							size="icon"
							type="button"
						>
							{getIsExpanded() ? (
								<ChevronDown className="size-4 text-muted-foreground" />
							) : (
								<ChevronRight className="size-4 text-muted-foreground" />
							)}
						</Button>
					) : (
						<div className="w-9" />
					)}
					<div
						className={cn(
							"size-8 rounded-full flex items-center justify-center text-white shrink-0",
							metadata?.color_bg ?? "bg-muted-foreground"
						)}
					>
						<Icon className="size-4" />
					</div>
					<span className="font-medium">{getValue() as string}</span>
				</div>
			);
		}
	}
];
