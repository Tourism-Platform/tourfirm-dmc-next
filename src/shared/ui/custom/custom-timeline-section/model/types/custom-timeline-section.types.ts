import type {
	TBlockTone,
	TCriteriaProps,
	TTimelineIndicatorType,
	TTimelineItemProps,
	TTimelineLayout
} from "@/shared/ui/blocks/types/block-render.types";

export type TTimelineSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	indicatorType?: TTimelineIndicatorType;
	items: TTimelineItemProps[];
	layout?: TTimelineLayout;
	tone?: TBlockTone;
	tags?: string[];
	criteria?: TCriteriaProps;
};
