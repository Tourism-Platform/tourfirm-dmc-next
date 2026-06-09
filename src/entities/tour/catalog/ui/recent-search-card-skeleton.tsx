import type { FC } from "react";

import { Card, CardContent, Skeleton } from "@/shared/ui";

export const RecentSearchCardSkeleton: FC = () => (
	<Card className="min-w-[200px] shrink-0 sm:min-w-0">
		<CardContent className="grid grid-cols-[min-content_1fr] gap-4 py-4">
			<Skeleton className="size-5 rounded-full" />
			<div className="flex flex-col gap-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</CardContent>
	</Card>
);
