"use client";

import { History, MapPin } from "lucide-react";
import type { FC } from "react";

import { useFormatDateRange } from "@/shared/hooks";
import { Card, CardContent } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IRecentSearch } from "../types";

interface IRecentSearchCardProps {
	data: IRecentSearch;
	onClick?: () => void;
}

export const RecentSearchCard: FC<IRecentSearchCardProps> = ({
	data,
	onClick
}) => {
	const { tours } = useUiContent();
	const { formatDateRange } = useFormatDateRange();

	const tourTypeLabel =
		data.tourType === "group"
			? tours.recent.tourType.group
			: data.tourType === "private"
				? tours.recent.tourType.private
				: null;

	return (
		<Card
			className="min-w-[200px] shrink-0 cursor-pointer transition-shadow hover:shadow-md sm:min-w-0"
			onClick={onClick}
		>
			<CardContent className="grid grid-cols-[min-content_1fr] gap-4">
				<div className="flex items-start pt-0.5">
					<History className="text-muted-foreground size-5" />
				</div>
				<div className="flex min-w-0 flex-col gap-1">
					<div className="flex items-center gap-1">
						<MapPin className="text-muted-foreground size-3.5 shrink-0" />
						<span className="truncate font-medium">
							{data.label}
						</span>
					</div>
					<span className="text-muted-foreground truncate text-sm">
						{formatDateRange(data.dates)}
					</span>
					{tourTypeLabel ? (
						<span className="text-muted-foreground text-xs capitalize">
							{tourTypeLabel}
						</span>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};
