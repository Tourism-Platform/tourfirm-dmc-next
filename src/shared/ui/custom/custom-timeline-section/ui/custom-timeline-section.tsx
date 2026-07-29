import { CustomSectionHeader } from "../../custom-section-header";
import type { TTimelineSectionProps } from "../model/types/custom-timeline-section.types";

import { TimelineList } from "./timeline-list";

export function TimelineSection({
	eyebrow,
	title,
	description,
	indicatorType = "number",
	items
}: TTimelineSectionProps) {
	const hasHeader = eyebrow || title || description;

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			{hasHeader ? (
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title}
					description={description}
				/>
			) : null}
			<TimelineList indicatorType={indicatorType} items={items} />
		</section>
	);
}
