import type {
	TTimelineIndicatorType,
	TTimelineItemProps
} from "@/shared/ui/blocks/types/block-render.types";

export type TTimelineSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	indicatorType?: TTimelineIndicatorType;
	items: TTimelineItemProps[];
};
