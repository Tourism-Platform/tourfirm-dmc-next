"use client";

import { type FC } from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

type TOrderReportProps = {
	report: string;
};

const OrderReportBase: FC<TOrderReportProps> = ({ report }) => {
	const { orders } = useUiContent();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{orders.report.title}</CardTitle>
			</CardHeader>
			<CardContent className="min-h-[200px]">
				<p className="whitespace-pre-wrap">{report}</p>
			</CardContent>
		</Card>
	);
};

export const OrderReport = withErrorBoundary(OrderReportBase);
