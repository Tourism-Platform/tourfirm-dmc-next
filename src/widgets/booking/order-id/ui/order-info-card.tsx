import { type FC } from "react";

import { Card, CardContent, CardHeader } from "@/shared/ui";

import { type IInfoItem } from "../model/types";

interface IOrderInfoCardProps {
	title: string;
	items: IInfoItem[];
}

export const OrderInfoCard: FC<IOrderInfoCardProps> = ({ title, items }) => {
	return (
		<Card className="gap-2">
			<CardHeader className="text-lg font-semibold block">
				{title}
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
				{items.map((item, index) => (
					<div key={index} className="flex flex-col gap-1">
						<span className="text-muted-foreground text-xs font-medium">
							{item.label}:
						</span>
						<span className="font-medium whitespace-pre-wrap">
							{item.value}
						</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
};
