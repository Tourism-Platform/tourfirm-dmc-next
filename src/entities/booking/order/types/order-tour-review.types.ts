import type { TPreviewOptionEventType } from "@/entities/tour/preview-tour";

export interface IOrderTourReviewItem {
	id: string;
	item: string;
	type?: TPreviewOptionEventType;
	day: number;
	position: number;
	optionIndex: number;
	subRows?: IOrderTourReviewItem[];
}
