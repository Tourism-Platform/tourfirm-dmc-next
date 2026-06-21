import { type FC, useMemo } from "react";

import { Skeleton } from "@/shared/ui";

interface ICustomAccordionRangeSkeletonProps {
	count?: number;
}

const getBarHeight = (index: number) => 10 + ((index * 37) % 70);

export const CustomAccordionRangeSkeleton: FC<
	ICustomAccordionRangeSkeletonProps
> = ({ count = 20 }) => {
	const heights = useMemo(
		() => Array.from({ length: count }, (_, index) => getBarHeight(index)),
		[count]
	);

	return (
		<div className="flex h-[100px] w-full items-end gap-1 px-2">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton
					key={i}
					className="flex-1"
					style={{
						height: `${heights[i]}%`
					}}
				/>
			))}
		</div>
	);
};
