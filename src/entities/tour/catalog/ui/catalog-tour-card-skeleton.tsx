import type { FC } from "react";

import { Card, CardContent, Skeleton } from "@/shared/ui";

export const CatalogTourCardSkeleton: FC = () => (
	<Card className="h-full gap-0 overflow-hidden pt-0">
		<Skeleton className="h-44 w-full rounded-none sm:h-48" />
		<CardContent className="grid gap-4 py-4">
			<Skeleton className="h-5 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-10 w-full" />
			<div className="flex justify-between">
				<Skeleton className="h-8 w-20" />
				<Skeleton className="h-6 w-24" />
			</div>
		</CardContent>
	</Card>
);
