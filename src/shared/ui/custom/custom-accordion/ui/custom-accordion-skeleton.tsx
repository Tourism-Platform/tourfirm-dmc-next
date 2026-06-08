import { Skeleton } from "@/shared/ui";

interface ICustomAccordionSkeletonProps {
	count?: number;
}

export const CustomAccordionSkeleton = ({
	count = 5
}: ICustomAccordionSkeletonProps) => {
	return (
		<>
			{Array.from({ length: count }).map((_, idx) => (
				<div key={idx} className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-sm" />
					<Skeleton className="h-4 w-32 rounded-sm" />
					<Skeleton className="h-4 w-8 rounded-sm ml-auto" />
				</div>
			))}
		</>
	);
};
