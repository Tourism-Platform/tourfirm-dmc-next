import { cn } from "@/shared/lib/utils";

import { CustomSectionHeader } from "../../custom-section-header";
import type { TRouteMapSectionProps } from "../model/types/custom-route-map-section.types";

import { RouteMapAside } from "./route-map-aside";
import { RouteMapCard } from "./route-map-card";

export function RouteMapSection({
	eyebrow,
	title,
	description,
	aside,
	mapPanel,
	...mapProps
}: TRouteMapSectionProps) {
	const hasHeader = Boolean(eyebrow || title || description);
	const hasAside = Boolean(
		aside &&
		(aside.eyebrow ||
			aside.title ||
			aside.description ||
			(aside.items && aside.items.length > 0))
	);

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			{hasHeader ? (
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title}
					description={description}
				/>
			) : null}
			<div
				className={cn(
					"grid min-w-0 gap-4 sm:gap-5",
					hasAside && "lg:grid-cols-[1fr_2fr]"
				)}
			>
				{hasAside && aside ? <RouteMapAside {...aside} /> : null}
				<RouteMapCard {...mapPanel} {...mapProps} />
			</div>
		</section>
	);
}
