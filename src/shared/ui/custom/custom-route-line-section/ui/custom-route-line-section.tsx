import { CustomSectionHeader } from "../../custom-section-header";
import type { TRouteLineSectionProps } from "../model/types/custom-route-line-section.types";

import { RouteLineTrack } from "./route-line-track";

export function RouteLineSection({
	eyebrow,
	title,
	description,
	start,
	end,
	items
}: TRouteLineSectionProps) {
	const hasHeader = eyebrow || title || description;
	const stops = items.slice(0, 5);

	if (!stops.length && !start && !end && !hasHeader) {
		return null;
	}

	return (
		<section className="flex flex-col gap-2">
			{hasHeader ? (
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title}
					description={description}
				/>
			) : null}
			<RouteLineTrack start={start} end={end} items={stops} />
		</section>
	);
}
