"use client";

import { getLucideIcon } from "@/shared/lib/get-lucide-icon";
import type {
	TTimelineIndicatorType,
	TTimelineItemProps
} from "@/shared/ui/blocks/types/block-render.types";
import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle
} from "@/shared/ui/shadcn-ui/timeline";

type TTimelineListProps = {
	indicatorType: TTimelineIndicatorType;
	items: TTimelineItemProps[];
};

export function TimelineList({ indicatorType, items }: TTimelineListProps) {
	if (!items.length) {
		return null;
	}

	return (
		<Timeline defaultValue={items.length}>
			{items.map((item, index) => {
				const step = index + 1;
				const Icon =
					indicatorType === "icon" ? getLucideIcon(item.icon) : null;

				return (
					<TimelineItem
						className="group-data-[orientation=vertical]/timeline:ms-10"
						key={item.key ?? String(index)}
						step={step}
					>
						<TimelineHeader>
							<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
							<TimelineTitle className="mt-0.5">
								{item.title}
							</TimelineTitle>
							<TimelineIndicator className="group-data-[orientation=vertical]/timeline:-left-7 flex size-6 items-center justify-center border-none bg-primary/10 text-xs font-medium group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
								{Icon ? <Icon size={14} /> : step}
							</TimelineIndicator>
						</TimelineHeader>
						{(item.description || item.date) && (
							<TimelineContent>
								{item.description}
								{item.date ? (
									<TimelineDate className="mt-2 mb-0">
										{item.date}
									</TimelineDate>
								) : null}
							</TimelineContent>
						)}
					</TimelineItem>
				);
			})}
		</Timeline>
	);
}
