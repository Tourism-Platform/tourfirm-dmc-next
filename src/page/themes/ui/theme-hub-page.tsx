import { ENUM_PATH } from "@/shared/config";
import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { BlocksLayout } from "@/shared/ui/blocks";
import { ExperienceCard, RouteCard } from "@/shared/ui/cards";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";

import {
	DiscoveryFilterBar,
	DiscoveryRelatedSection
} from "@/widgets/discovery";

import { mapCmsBlocks } from "@/cms/lib";
import {
	mapExperienceToCard,
	mapRouteToCard
} from "@/cms/lib/map-discovery-cards";
import type { Experience, Route, Theme } from "@/payload-types";

type TProps = {
	theme: Theme;
	routes: Route[];
	experiences: Experience[];
	breadcrumbItems: TBreadcrumbItem[];
};

export function ThemeHubPage({
	theme,
	routes,
	experiences,
	breadcrumbItems
}: TProps) {
	const sections = mapCmsBlocks(theme.blocks);
	const routeCards = routes.map(mapRouteToCard);
	const experienceCards = experiences.map(mapExperienceToCard);

	return (
		<div className="flex flex-col">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
				<CustomSectionHeader
					eyebrow="Theme"
					title={theme.title}
					description={theme.description ?? undefined}
				/>
				<DiscoveryFilterBar
					filters={[
						{
							label: "All routes",
							value: "routes",
							href: `${ENUM_PATH.DISCOVERY.ROUTES}?theme=${theme.slug}`,
							active: false
						},
						{
							label: "All experiences",
							value: "experiences",
							href: `${ENUM_PATH.DISCOVERY.EXPERIENCES}?theme=${theme.slug}`,
							active: false
						}
					]}
				/>
			</div>

			{sections.length ? (
				<BlocksLayout
					sections={sections}
					breadcrumbItems={breadcrumbItems}
				/>
			) : null}

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 sm:gap-14 sm:px-6 lg:px-8">
				{routeCards.length ? (
					<DiscoveryRelatedSection title="Routes in this theme">
						{routeCards.map((card) => (
							<RouteCard key={card.href} data={card} />
						))}
					</DiscoveryRelatedSection>
				) : null}

				{experienceCards.length ? (
					<DiscoveryRelatedSection title="Experiences in this theme">
						{experienceCards.map((card) => (
							<ExperienceCard key={card.href} data={card} />
						))}
					</DiscoveryRelatedSection>
				) : null}
			</div>
		</div>
	);
}
