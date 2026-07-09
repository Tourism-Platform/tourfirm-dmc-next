import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import {
	BlockType,
	BlocksLayout,
	type TBlockRenderProps
} from "@/shared/ui/blocks";
import { ExperienceCard, RouteCard } from "@/shared/ui/cards";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";
import { RouteMapView } from "@/shared/ui/route-map";

import {
	DiscoveryCatalogCta,
	DiscoveryRelatedSection,
	GeoExplorationSection,
	RouteStopsTimeline
} from "@/widgets/discovery";

import { mapCmsBlocks } from "@/cms/lib";
import {
	buildCatalogHref,
	extractMapPoints,
	mapAttractionToGeoCard,
	mapCityToGeoCard,
	mapCountryToGeoCard,
	mapExperienceToCard,
	mapRouteToCard,
	resolveRelatedRoutes,
	resolveRouteExperiences
} from "@/cms/lib/map-discovery-cards";
import {
	mapRoutePointsToStops,
	mapRoutePointsToTimeline,
	resolveRouteMapCenter
} from "@/cms/lib/map-route-points";
import type { Route } from "@/payload-types";

const ROUTE_MAP_TILE_URL =
	"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const ROUTE_MAP_TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

type TProps = {
	route: Route;
	navigationRootSlug: string;
	breadcrumbItems: TBreadcrumbItem[];
};

function splitRouteSections(blocks: TBlockRenderProps[]) {
	const heroSections = blocks.filter(
		(section) => section.blockType === BlockType.hero
	);
	const overviewStatsSections = blocks.filter(
		(section) => section.blockType === BlockType.overviewStats
	);
	const contentSections = blocks.filter(
		(section) =>
			section.blockType !== BlockType.hero &&
			section.blockType !== BlockType.overviewStats &&
			section.blockType !== BlockType.routeMap
	);

	return { heroSections, overviewStatsSections, contentSections };
}

export function RouteDetailPage({
	route,
	navigationRootSlug,
	breadcrumbItems
}: TProps) {
	const allSections = mapCmsBlocks(route.blocks).filter(
		(section) => section.blockType !== BlockType.routeMap
	);
	const { heroSections, overviewStatsSections, contentSections } =
		splitRouteSections(allSections);
	const mapPoints = extractMapPoints(route);
	const stops = mapRoutePointsToStops(mapPoints);
	const timeline = mapRoutePointsToTimeline(mapPoints);
	const center = resolveRouteMapCenter(mapPoints);
	const countries =
		route.countries
			?.filter(
				(country): country is Exclude<typeof country, number> =>
					typeof country === "object" && country !== null
			)
			.map((country) =>
				mapCountryToGeoCard(country, navigationRootSlug)
			) ?? [];
	const cities =
		route.cities
			?.filter(
				(city): city is Exclude<typeof city, number> =>
					typeof city === "object" && city !== null
			)
			.map((city) => mapCityToGeoCard(city, navigationRootSlug)) ?? [];
	const attractions =
		route.attractions
			?.filter(
				(
					attraction
				): attraction is Exclude<typeof attraction, number> =>
					typeof attraction === "object" && attraction !== null
			)
			.map((attraction) =>
				mapAttractionToGeoCard(attraction, navigationRootSlug)
			) ?? [];
	const experiences = resolveRouteExperiences(route).map(mapExperienceToCard);
	const relatedRoutes = resolveRelatedRoutes(route).map(mapRouteToCard);

	return (
		<div className="flex flex-col">
			<BlocksLayout
				sections={[...heroSections, ...overviewStatsSections]}
				breadcrumbItems={breadcrumbItems}
			/>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				{contentSections.length ? (
					<BlocksLayout sections={contentSections} />
				) : null}

				{stops.length ? (
					<section className="flex flex-col gap-6 sm:gap-8">
						<CustomSectionHeader
							eyebrow="Route map"
							title="Follow the journey"
							description="Interactive map with the ordered stops of this route."
						/>
						<RouteMapView
							stops={stops}
							center={center}
							zoom={6}
							minZoom={4}
							maxZoom={18}
							tileUrl={ROUTE_MAP_TILE_URL}
							tileAttribution={ROUTE_MAP_TILE_ATTRIBUTION}
						/>
					</section>
				) : null}

				<RouteStopsTimeline items={timeline} />

				<GeoExplorationSection
					countries={countries}
					cities={cities}
					attractions={attractions}
				/>

				{experiences.length ? (
					<DiscoveryRelatedSection
						eyebrow="Experiences"
						title="Experiences along this route"
						description="Activities and impressions you can weave into this journey."
					>
						{experiences.map((experience) => (
							<ExperienceCard
								key={experience.href}
								data={experience}
							/>
						))}
					</DiscoveryRelatedSection>
				) : null}

				{relatedRoutes.length ? (
					<DiscoveryRelatedSection
						eyebrow="More inspiration"
						title="Related routes"
					>
						{relatedRoutes.map((relatedRoute) => (
							<RouteCard
								key={relatedRoute.href}
								data={relatedRoute}
							/>
						))}
					</DiscoveryRelatedSection>
				) : null}

				<DiscoveryCatalogCta
					title="Ready to plan this route?"
					description="Tell us your dates, group size, and pace — we will shape a commercial program around this inspiration."
					catalogHref={buildCatalogHref(route.catalogQuery)}
				/>
			</div>
		</div>
	);
}
