import { CustomSectionHeader } from "../../custom-section-header";
import type { TFaqSectionProps } from "../model/types/custom-faq-section.types";

import { FaqAccordion } from "./faq-accordion";

export function FaqSection({
	eyebrow,
	title,
	description,
	questions
}: TFaqSectionProps) {
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
			<FaqAccordion questions={questions} />
		</section>
	);
}
