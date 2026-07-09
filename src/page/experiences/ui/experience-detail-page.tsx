import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { BlockType, BlocksLayout } from "@/shared/ui/blocks";
import { ExperienceCard, RouteCard } from "@/shared/ui/cards";

import {
	DiscoveryCatalogCta,
	DiscoveryRelatedSection,
	ExperienceMetaBar,
	GeoExplorationSection
} from "@/widgets/discovery";

import { mapCmsBlocks } from "@/cms/lib";
import {
	buildCatalogHref,
	mapAttractionToGeoCard,
	mapCityToGeoCard,
	mapCountryToGeoCard,
	mapExperienceToCard,
	mapRouteToCard,
	resolveExperienceRoutes,
	resolveRelatedExperiences
} from "@/cms/lib/map-discovery-cards";
import type { Experience } from "@/payload-types";

type TProps = {
	experience: Experience;
	navigationRootSlug: string;
	breadcrumbItems: TBreadcrumbItem[];
	similarExperiences?: Experience[];
};

export function ExperienceDetailPage({
	experience,
	navigationRootSlug,
	breadcrumbItems,
	similarExperiences = []
}: TProps) {
	const sections = mapCmsBlocks(experience.blocks).filter(
		(section) => section.blockType !== BlockType.routeMap
	);
	const country =
		typeof experience.country === "object" ? experience.country : null;
	const city = typeof experience.city === "object" ? experience.city : null;
	const attraction =
		typeof experience.attraction === "object"
			? experience.attraction
			: null;
	const countries = country
		? [mapCountryToGeoCard(country, navigationRootSlug)]
		: [];
	const cities = city ? [mapCityToGeoCard(city, navigationRootSlug)] : [];
	const attractions = attraction
		? [mapAttractionToGeoCard(attraction, navigationRootSlug)]
		: [];
	const relatedRoutes =
		resolveExperienceRoutes(experience).map(mapRouteToCard);
	const curatedSimilar =
		resolveRelatedExperiences(experience).map(mapExperienceToCard);
	const fallbackSimilar = similarExperiences.map(mapExperienceToCard);
	const similar =
		curatedSimilar.length > 0 ? curatedSimilar : fallbackSimilar;
	const location = [city?.title, country?.title].filter(Boolean).join(", ");
	const themes =
		experience.themes
			?.map((theme) =>
				typeof theme === "object" ? theme.title : undefined
			)
			.filter((title): title is string => Boolean(title)) ?? [];

	return (
		<div className="flex flex-col">
			<BlocksLayout
				sections={sections}
				breadcrumbItems={breadcrumbItems}
			/>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				<ExperienceMetaBar
					type={
						experience.type
							? experience.type.replaceAll("_", " ").toLowerCase()
							: undefined
					}
					duration={experience.duration}
					location={location}
					themes={themes}
				/>

				<GeoExplorationSection
					countries={countries}
					cities={cities}
					attractions={attractions}
				/>

				{relatedRoutes.length ? (
					<DiscoveryRelatedSection
						eyebrow="Routes"
						title="Routes that include this experience"
					>
						{relatedRoutes.map((route) => (
							<RouteCard key={route.href} data={route} />
						))}
					</DiscoveryRelatedSection>
				) : null}

				{similar.length ? (
					<DiscoveryRelatedSection
						eyebrow="Similar"
						title="Similar experiences"
					>
						{similar.map((item) => (
							<ExperienceCard key={item.href} data={item} />
						))}
					</DiscoveryRelatedSection>
				) : null}

				<DiscoveryCatalogCta
					title="Want this experience in your trip?"
					description="We can weave this impression into a private program, group departure, or MICE itinerary."
					catalogHref={buildCatalogHref(experience.catalogQuery)}
				/>
			</div>
		</div>
	);
}
