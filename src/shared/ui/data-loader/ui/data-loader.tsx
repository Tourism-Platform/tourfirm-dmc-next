import type { FC } from "react";

import { cn } from "@/shared/lib";

type TDataLoaderProps = {
	className?: string;
};

const MAP_SRC = "/assets/images/map.svg";

export const DataLoader: FC<TDataLoaderProps> = ({ className }) => {
	return (
		<div
			className={cn(
				"flex min-h-0 w-full flex-1 items-center justify-center",
				className
			)}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={MAP_SRC}
				alt=""
				className="h-auto w-[min(90%,18rem)] animate-pulse object-contain sm:w-[min(80%,24rem)] lg:w-[min(70%,32rem)]"
			/>
		</div>
	);
};
