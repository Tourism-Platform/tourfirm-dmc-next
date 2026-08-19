import type { FC } from "react";

import mapSrc from "@/shared/assets/map.svg";
import { cn } from "@/shared/lib";

type TDataLoaderProps = {
	className?: string;
};

const mapUrl = typeof mapSrc === "string" ? mapSrc : mapSrc.src;

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
				src={mapUrl}
				alt=""
				className="h-auto w-[min(90%,18rem)] animate-pulse object-contain sm:w-[min(80%,24rem)] lg:w-[min(70%,32rem)]"
			/>
		</div>
	);
};
