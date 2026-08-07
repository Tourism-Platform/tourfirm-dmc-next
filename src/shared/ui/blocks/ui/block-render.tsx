import type { ReactNode } from "react";

import { ButtonRender } from "@/shared/ui/buttons";
import { CardsSection } from "@/shared/ui/custom/custom-cards-section";
import { CustomCtaBanner } from "@/shared/ui/custom/custom-cta-banner";
import { FaqSection } from "@/shared/ui/custom/custom-faq-section";
import { ItinerarySection } from "@/shared/ui/custom/custom-itinerary-section";
import { OverviewStatsSection } from "@/shared/ui/custom/custom-overview-stats-section";
import { CustomPageHero } from "@/shared/ui/custom/custom-page-hero";
import { RouteLineSection } from "@/shared/ui/custom/custom-route-line-section";
import { RouteMapSection } from "@/shared/ui/custom/custom-route-map-section";
import { TimelineSection } from "@/shared/ui/custom/custom-timeline-section";

import { BlockType, type TBlockRenderProps } from "../types/block-render.types";

type TBlockRenderOptions = {
	topContent?: ReactNode;
};

export function BlockRender({
	topContent,
	...section
}: TBlockRenderProps & TBlockRenderOptions) {
	if (
		section.blockType === BlockType.mostPopularTours ||
		section.blockType === BlockType.specialOffers
	) {
		return null;
	}

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
							email: action.item.email,
							variant: action.item.variant
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
			<RouteMapSection
				eyebrow={section.eyebrow}
				title={section.title!}
				description={section.description}
				aside={section.aside}
				mapPanel={section.mapPanel}
				stops={section.stops ?? []}
				center={section.center!}
				zoom={section.zoom!}
				minZoom={section.minZoom!}
				maxZoom={section.maxZoom!}
				tileUrl={section.tileUrl!}
				tileAttribution={section.tileAttribution!}
			/>
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

	if (section.blockType === BlockType.timeline) {
		return (
			<TimelineSection
				eyebrow={section.eyebrow}
				title={section.title!}
				description={section.description}
				indicatorType={section.indicatorType}
				items={section.items ?? []}
			/>
		);
	}

	if (section.blockType === BlockType.itinerary) {
		return (
			<ItinerarySection
				eyebrow={section.eyebrow}
				title={section.title!}
				description={section.description}
				note={section.note}
				items={section.itineraryItems ?? []}
			/>
		);
	}

	if (section.blockType === BlockType.routeLine) {
		return (
			<RouteLineSection
				eyebrow={section.eyebrow}
				title={section.title!}
				description={section.description}
				start={section.start}
				end={section.end}
				items={section.routeLineItems ?? []}
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
							email: action.item.email,
							variant: action.item.variant
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
			displayMode={section.displayMode}
			emptyLabel={section.emptyLabel}
			rows={section.rows}
			actions={section.actions?.map((action, actionIndex) => (
				<ButtonRender
					key={actionIndex}
					type={action.type}
					item={{
						title: action.item.title,
						href: action.item.href,
						email: action.item.email,
						variant: action.item.variant
					}}
				/>
			))}
			cards={section.cards ?? []}
		/>
	);
}
