import { ENUM_PATH } from "@/shared/config";
import type {
	TDiscoveryNavItem,
	TDiscoveryNavTree
} from "@/shared/types/discovery-nav.types";

type TDiscoveryNavSource = {
	id: number | string;
	slug: string;
	title: string;
	subtitle?: string | null;
};

export function buildRoutesNavTree(
	routes: TDiscoveryNavSource[]
): TDiscoveryNavTree {
	return {
		rootHref: ENUM_PATH.DISCOVERY.ROUTES,
		items: routes.map(mapRouteNavItem)
	};
}

export function buildExperiencesNavTree(
	experiences: TDiscoveryNavSource[]
): TDiscoveryNavTree {
	return {
		rootHref: ENUM_PATH.DISCOVERY.EXPERIENCES,
		items: experiences.map(mapExperienceNavItem)
	};
}

function mapRouteNavItem(route: TDiscoveryNavSource): TDiscoveryNavItem {
	return {
		id: String(route.id),
		slug: route.slug,
		title: route.title,
		href: ENUM_PATH.DISCOVERY.routeDetail(route.slug),
		subtitle: route.subtitle?.trim() || undefined
	};
}

function mapExperienceNavItem(
	experience: TDiscoveryNavSource
): TDiscoveryNavItem {
	return {
		id: String(experience.id),
		slug: experience.slug,
		title: experience.title,
		href: ENUM_PATH.DISCOVERY.experienceDetail(experience.slug),
		subtitle: experience.subtitle?.trim() || undefined
	};
}
