import Image from "next/image";

import { cn } from "@/shared/lib/utils";

import type { TPortraitCardProps } from "../types/portrait-card.types";

export function PortraitCard({ data }: TPortraitCardProps) {
	if (!data.imageUrl) {
		return null;
	}

	return (
		<figure className="flex flex-col gap-3">
			<div
				className={cn(
					"relative overflow-hidden rounded-2xl border border-border/60",
					"aspect-[3/4] w-full bg-muted"
				)}
			>
				<Image
					src={data.imageUrl}
					alt={data.imageAlt}
					fill
					className="object-cover object-top"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			{data.title || data.description ? (
				<figcaption className="flex flex-col gap-1">
					{data.title ? (
						<p className="text-sm font-semibold sm:text-base">
							{data.title}
						</p>
					) : null}
					{data.description ? (
						<p className="text-muted-foreground text-sm">
							{data.description}
						</p>
					) : null}
				</figcaption>
			) : null}
		</figure>
	);
}
