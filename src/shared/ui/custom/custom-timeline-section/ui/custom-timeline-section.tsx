import { ToneBand } from "@/shared/ui/blocks";

import { CustomSectionHeader } from "../../custom-section-header";
import { TagList } from "../../custom-tag-list";
import type { TTimelineSectionProps } from "../model/types/custom-timeline-section.types";

import { TimelineCriteria } from "./timeline-criteria";
import { TimelineList } from "./timeline-list";
import { TimelineStepper } from "./timeline-stepper";

export function TimelineSection({
	eyebrow,
	title,
	description,
	indicatorType = "number",
	items,
	layout = "vertical",
	tone,
	tags,
	criteria
}: TTimelineSectionProps) {
	const hasHeader = eyebrow || title || description;
	const isHorizontal = layout === "horizontal";

	return (
		<ToneBand tone={tone}>
			<section className="flex flex-col gap-6 sm:gap-8">
				{hasHeader ? (
					<CustomSectionHeader
						eyebrow={eyebrow}
						title={title}
						description={description}
					/>
				) : null}
				<TagList tags={tags} className="flex flex-wrap gap-2" />
				{isHorizontal ? (
					<TimelineStepper items={items} />
				) : (
					<TimelineList indicatorType={indicatorType} items={items} />
				)}
				{criteria ? <TimelineCriteria criteria={criteria} /> : null}
			</section>
		</ToneBand>
	);
}
