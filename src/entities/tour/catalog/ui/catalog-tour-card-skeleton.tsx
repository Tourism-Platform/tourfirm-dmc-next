import type { FC } from "react";

import { Card, CardContent, CardFooter, Skeleton } from "@/shared/ui";

export const CatalogTourCardSkeleton: FC = () => (
	<Card className="flex h-full flex-col gap-0 overflow-hidden pt-0 pb-0">
		<Skeleton className="h-44 w-full shrink-0 rounded-none sm:h-48" />
		<CardContent className="grid flex-1 gap-4 py-4">
			<Skeleton className="h-5 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-10 w-full" />
			<div className="mt-auto flex justify-between">
				<Skeleton className="h-8 w-20" />
				<Skeleton className="h-6 w-24" />
			</div>
		</CardContent>
		<CardFooter className="border-t pt-3 pb-4">
			<Skeleton className="h-10 w-full" />
		</CardFooter>
	</Card>
);
