"use client";

import { getLucideIcon } from "@/shared/lib/get-lucide-icon";
import type { TFaqQuestionProps } from "@/shared/ui/blocks/types/block-render.types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/shared/ui/shadcn-ui/accordion";

type TFaqAccordionProps = {
	questions: TFaqQuestionProps[];
};

export function FaqAccordion({ questions }: TFaqAccordionProps) {
	return (
		<Accordion type="multiple" className="w-full">
			{questions.map((question, index) => {
				const Icon = getLucideIcon(question.icon);
				const value = question.key ?? String(index);

				return (
					<AccordionItem key={value} value={value}>
						<AccordionTrigger className="text-base sm:text-lg">
							<span className="flex items-center gap-2 text-left">
								<Icon className="text-primary size-5 shrink-0" />
								{question.title}
							</span>
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground text-sm sm:text-base">
							{question.description}
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
