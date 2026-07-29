import type { TItineraryItemProps } from "@/shared/ui/blocks/types/block-render.types";

export type TItinerarySectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	note?: string;
	items: TItineraryItemProps[];
};
