import type { FC } from "react";

import { Card, CardContent, CardHeader, Skeleton } from "@/shared/ui";

export const CatalogTourCardSkeleton: FC = () => {
	return (
		<Card className="flex h-full min-w-0 flex-col gap-0 overflow-hidden pt-0 pb-4">
			<Skeleton className="h-48 w-full rounded-none" />
			<CardHeader className="grid gap-2.5 pt-4 pb-3">
				<Skeleton className="h-5 w-4/5" />
				<Skeleton className="h-5 w-3/5" />
				<Skeleton className="h-3.5 w-full" />
				<div className="flex gap-1">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
				<div className="grid gap-1">
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-4/5" />
				</div>
			</CardHeader>
			<CardContent className="mt-auto grid gap-3">
				<div className="grid grid-cols-2 gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-9 w-full rounded-md" />
					))}
				</div>
				<div className="flex items-center justify-end border-t pt-3">
					<Skeleton className="h-5 w-28" />
				</div>
			</CardContent>
			<div className="px-6 pt-1">
				<Skeleton className="h-10 w-full" />
			</div>
		</Card>
	);
};
