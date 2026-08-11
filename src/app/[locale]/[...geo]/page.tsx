import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SuspenseLoader } from "@/shared/ui";

import { resolveAppRoute } from "@/cms/routing";
import {
	buildCmsRouteMetadata,
	renderCmsRoute
} from "@/cms/routing/render-cms-route";

export const revalidate = 60;

type TSearchParams = { page?: string; theme?: string; country?: string };

type TProps = {
	params: Promise<{ locale: string; geo: string[] }>;
	searchParams: Promise<TSearchParams>;
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

type TGeoContentProps = {
	locale: string;
	segments: string[];
	searchParams: Promise<TSearchParams>;
};

async function GeoContent({
	locale,
	segments,
	searchParams
}: TGeoContentProps) {
	const query = await searchParams;

	setRequestLocale(locale);

	const route = await resolveAppRoute(locale, segments);

	if (!route) {
		notFound();
	}

	return renderCmsRoute(route, locale, query);
}

export default async function GeoCatchAllRoute({
	params,
	searchParams
}: TProps) {
	const { locale, geo } = await params;
	const segments = geo ?? [];

	setRequestLocale(locale);

	return (
		<Suspense fallback={<SuspenseLoader />}>
			<GeoContent
				locale={locale}
				segments={segments}
				searchParams={searchParams}
			/>
		</Suspense>
	);
}
