import { CustomSectionHeader } from "../../custom-section-header";
import type { TItinerarySectionProps } from "../model/types/custom-itinerary-section.types";

import { ItineraryList } from "./itinerary-list";

export function ItinerarySection({
	eyebrow,
	title,
	description,
	note,
	items
}: TItinerarySectionProps) {
	const hasHeader = eyebrow || title || description || note;

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			{hasHeader ? (
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
					<CustomSectionHeader
						eyebrow={eyebrow}
						title={title}
						description={description}
					/>
					{note ? (
						<p className="text-muted-foreground shrink-0 font-mono text-[11px] tracking-[0.08em] sm:pb-1">
							{note}
						</p>
					) : null}
				</div>
			) : null}
			<ItineraryList items={items} />
		</section>
	);
}
