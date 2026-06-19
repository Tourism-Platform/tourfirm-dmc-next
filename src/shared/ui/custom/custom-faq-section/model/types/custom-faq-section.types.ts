import type { TFaqQuestionProps } from "@/shared/ui/blocks/types/block-render.types";

export type TFaqSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	questions: TFaqQuestionProps[];
};
