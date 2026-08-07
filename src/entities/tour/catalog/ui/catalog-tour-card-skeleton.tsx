import type { FC } from "react";

import { Card, CardContent, CardHeader, Skeleton } from "@/shared/ui";

export const CatalogTourCardSkeleton: FC = () => {
	return (
		<Card className="flex h-full min-w-0 flex-col gap-0 overflow-hidden pt-0 pb-3 sm:pb-4">
			<Skeleton className="h-36 w-full rounded-none sm:h-48" />
			<CardHeader className="grid gap-2 pt-3 pb-2 sm:gap-2.5 sm:pt-4 sm:pb-3">
				<Skeleton className="h-4 w-4/5 sm:h-5" />
				<Skeleton className="h-4 w-3/5 sm:h-5" />
				<Skeleton className="h-3 w-full sm:h-3.5" />
				<div className="flex gap-1">
					<Skeleton className="h-4 w-16 rounded-full sm:h-5 sm:w-20" />
					<Skeleton className="h-4 w-14 rounded-full sm:h-5 sm:w-16" />
				</div>
				<div className="grid gap-1">
					<Skeleton className="h-3 w-full sm:h-3.5" />
					<Skeleton className="h-3 w-4/5 sm:h-3.5" />
				</div>
			</CardHeader>
			<CardContent className="mt-auto grid gap-2.5 px-4 sm:gap-3 sm:px-6">
				<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-8 w-full rounded-md sm:h-9"
						/>
					))}
				</div>
				<div className="flex items-center justify-end border-t pt-2.5 sm:pt-3">
					<Skeleton className="h-4 w-24 sm:h-5 sm:w-28" />
				</div>
			</CardContent>
			<div className="px-4 pt-1 sm:px-6">
				<Skeleton className="h-9 w-full sm:h-10" />
			</div>
		</Card>
	);
};
