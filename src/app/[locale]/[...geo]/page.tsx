import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { resolveAppRoute } from "@/cms/routing";
import {
	buildCmsRouteMetadata,
	renderCmsRoute
} from "@/cms/routing/render-cms-route";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: string; geo: string[] }>;
	searchParams: Promise<{ page?: string; theme?: string; country?: string }>;
};

export async function generateMetadata({ params, searchParams }: TProps) {
	const { locale, geo } = await params;
	const query = await searchParams;
	const route = await resolveAppRoute(locale, geo ?? []);

	if (!route) {
		return {};
	}

	return buildCmsRouteMetadata(route, locale, query);
}

export default async function GeoCatchAllRoute({
	params,
	searchParams
}: TProps) {
	const { locale, geo } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const segments = geo ?? [];
	const route = await resolveAppRoute(locale, segments);

	if (!route) {
		notFound();
	}

	return renderCmsRoute(route, locale, query);
}
