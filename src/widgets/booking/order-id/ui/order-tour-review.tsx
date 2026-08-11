"use client";

import { useMemo } from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	SmartTable,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { type IOrderTourReviewItem } from "@/entities/booking";

import { TOUR_REVIEW_COLUMNS } from "../model/config";

type TOrderTourReviewProps = {
	items: IOrderTourReviewItem[];
};

const TABLE_LAYOUT = {
	rowBorder: true,
	headerBackground: false
};

const getSubRowsFn = (row: IOrderTourReviewItem) => row.subRows;

const OrderTourReviewBase = ({ items }: TOrderTourReviewProps) => {
	const { orders } = useUiContent();

	const columns = useMemo(
		() => TOUR_REVIEW_COLUMNS(orders.tourReview.table),
		[orders.tourReview.table]
	);

	return (
		<Card>
			<CardHeader className="gap-4">
				<CardTitle className="text-lg font-semibold">
					{orders.tourReview.title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<SmartTable
					data={items}
					columns={columns}
					getSubRows={getSubRowsFn}
					tableLayout={TABLE_LAYOUT}
					showTopFilters={false}
					defaultExpanded={true}
				/>
			</CardContent>
		</Card>
	);
};

export const OrderTourReview = withErrorBoundary(OrderTourReviewBase);
