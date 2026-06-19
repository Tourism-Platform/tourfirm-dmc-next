import type { ReactNode } from "react";

import { ButtonRender } from "@/shared/ui/buttons";
import { CardsSection } from "@/shared/ui/custom/custom-cards-section";
import { CustomCtaBanner } from "@/shared/ui/custom/custom-cta-banner";
import { FaqSection } from "@/shared/ui/custom/custom-faq-section";
import { OverviewStatsSection } from "@/shared/ui/custom/custom-overview-stats-section";
import { CustomPageHero } from "@/shared/ui/custom/custom-page-hero";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";
import { RouteMapView } from "@/shared/ui/route-map/ui/route-map-view";

import { BlockType, type TBlockRenderProps } from "../types/block-render.types";

type TBlockRenderOptions = {
	topContent?: ReactNode;
};

export function BlockRender({
	topContent,
	...section
}: TBlockRenderProps & TBlockRenderOptions) {
	if (section.blockType === BlockType.hero) {
		return (
			<CustomPageHero
				imageSrc={section.imageSrc!}
				imageAlt={section.imageAlt ?? section.title ?? "Main Hero"}
				title={section.title!}
				topContent={topContent}
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

	if (section.blockType === BlockType.routeMap) {
		return (
			<section className="flex flex-col gap-6 sm:gap-8">
				<CustomSectionHeader
					eyebrow={section.eyebrow}
					title={section.title!}
					description={section.description}
				/>
				<RouteMapView
					stops={section.stops ?? []}
					center={section.center!}
					zoom={section.zoom!}
					minZoom={section.minZoom!}
					maxZoom={section.maxZoom!}
					tileUrl={section.tileUrl!}
					tileAttribution={section.tileAttribution!}
				/>
			</section>
		);
	}

	if (section.blockType === BlockType.faq) {
		return (
			<FaqSection
				eyebrow={section.eyebrow}
				title={section.title!}
				description={section.description}
				questions={section.questions ?? []}
			/>
		);
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
