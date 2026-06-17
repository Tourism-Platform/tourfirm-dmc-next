import { cn } from "@/shared/lib";
import { CardRender } from "@/shared/ui/cards/ui/card-render";

import { CustomSectionHeader } from "../../custom-section-header";
import type { TCardsSectionProps } from "../model/types/custom-cards-section.types";

export function CardsSection({
	eyebrow,
	title,
	description,
	cards,
	gridClassName,
	actions
}: TCardsSectionProps) {
	const hasHeader = eyebrow || title || description || actions;
	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			{hasHeader && (
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title!}
					description={description}
					actions={actions}
				/>
			)}
			<div
				className={cn(
					"grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3",
					gridClassName
				)}
			>
				{cards.map((card, index) => (
					<CardRender
						key={card.key ?? String(index)}
						type={card.type}
						item={card.item}
					/>
				))}
			</div>
		</section>
	);
}
