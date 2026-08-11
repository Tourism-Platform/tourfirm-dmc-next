"use client";

import { type FC, useCallback, useMemo } from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	SmartTable,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { type TPaxReviewDetail, type TPaxReviewItem } from "@/entities/booking";

import { PAX_DETAILS_COLUMNS, PAX_REVIEW_COLUMNS } from "../model/config";

const SUBTABLE_LAYOUT = {
	rowBorder: true,
	headerBackground: true,
	showHeader: false
};

const MAIN_TABLE_LAYOUT = {
	rowBorder: true,
	headerBackground: false
};

const getRowCanExpandFn = (row: { original: TPaxReviewItem }) =>
	row.original.items.length > 0;

const OrderPaxReviewSubTable: FC<{ items: TPaxReviewDetail[] }> = ({
	items
}) => {
	const { orders } = useUiContent();
	const columns = useMemo(
		() => PAX_DETAILS_COLUMNS(orders.paxInformation.table),
		[orders.paxInformation.table]
	);

	return (
		<div className="p-2">
			<SmartTable
				data={items}
				columns={columns}
				showTopFilters={false}
				showPagination={false}
				tableLayout={SUBTABLE_LAYOUT}
			/>
		</div>
	);
};

type TOrderPaxReviewProps = {
	items?: TPaxReviewItem[];
};

const OrderPaxReviewBase: FC<TOrderPaxReviewProps> = ({ items = [] }) => {
	const { orders } = useUiContent();

	const renderSubTable = useCallback(
		(subItems: TPaxReviewDetail[]) => (
			<OrderPaxReviewSubTable items={subItems} />
		),
		[]
	);

	const columns = useMemo(
		() => PAX_REVIEW_COLUMNS(orders.paxInformation.table, renderSubTable),
		[orders.paxInformation.table, renderSubTable]
	);

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">
				<CardTitle>{orders.paxInformation.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<SmartTable
					data={items}
					columns={columns}
					getRowCanExpand={getRowCanExpandFn}
					tableLayout={MAIN_TABLE_LAYOUT}
					showTopFilters={false}
				/>
			</CardContent>
		</Card>
	);
};

export const OrderPaxReview = withErrorBoundary(OrderPaxReviewBase);
