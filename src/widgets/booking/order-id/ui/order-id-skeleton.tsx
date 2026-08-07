import { type FC } from "react";

import { Skeleton } from "@/shared/ui";

export const OrderIdSkeleton: FC = () => {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-9 w-[220px]" />
					<Skeleton className="h-6 w-[200px]" />
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Skeleton className="h-[280px] w-full rounded-xl" />
				<Skeleton className="h-[280px] w-full rounded-xl" />
			</div>

			<Skeleton className="h-[240px] w-full rounded-xl" />
		</div>
	);
};
