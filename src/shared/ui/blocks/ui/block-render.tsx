import { ButtonRender } from "@/shared/ui/buttons";
import { CardsSection } from "@/shared/ui/custom/custom-cards-section";
import { CustomCtaBanner } from "@/shared/ui/custom/custom-cta-banner";
import { CustomPageHero } from "@/shared/ui/custom/custom-page-hero";
import { OverviewStatsSection } from "@/shared/ui/custom/custom-overview-stats-section";

import { BlockType, type TBlockRenderProps } from "../types/block-render.types";

export function BlockRender(section: TBlockRenderProps) {
	if (section.blockType === BlockType.hero) {
		return (
			<CustomPageHero
				imageSrc={section.imageSrc!}
				imageAlt={section.imageAlt ?? section.title ?? "Main Hero"}
				title={section.title!}
				description={section.description!}
				actions={section.actions?.map((action, actionIndex) => (
					<ButtonRender
						key={actionIndex}
						type={action.type}
						item={{
							title: action.item.title,
							href: action.item.href,
							email: action.item.email
						}}
					/>
				))}
			>
				{section.children}
			</CustomPageHero>
		);
	}

	if (section.blockType === BlockType.overviewStats) {
		return <OverviewStatsSection cards={section.cards ?? []} />;
	}

	if (section.blockType === BlockType.cta) {
		return (
			<CustomCtaBanner
				eyebrow={section.eyebrow}
				title={section.title}
				description={section.description}
				imageSrc={section.imageSrc}
				actions={section.actions?.map((action, actionIndex) => (
					<ButtonRender
						key={actionIndex}
						type={action.type}
						item={{
							title: action.item.title,
							href: action.item.href,
							email: action.item.email
						}}
					/>
				))}
			/>
		);
	}

	return (
		<CardsSection
			eyebrow={section.eyebrow!}
			title={section.title!}
			description={section.description}
			gridClassName={section.gridClassName}
			actions={section.actions?.map((action, actionIndex) => (
				<ButtonRender
					key={actionIndex}
					type={action.type}
					item={{
						title: action.item.title,
						href: action.item.href,
						email: action.item.email
					}}
				/>
			))}
			cards={section.cards ?? []}
		/>
	);
}
