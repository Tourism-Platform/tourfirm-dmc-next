import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { resolveAppRoute } from "@/cms/routing";
import {
	buildCmsRouteMetadata,
	renderCmsRoute
} from "@/cms/routing/render-cms-route";

export type TCmsSearchParams = {
	page?: string;
	theme?: string;
	country?: string;
};

type TRenderArgs = {
	locale: string;
	segments: string[];
	searchParams?: TCmsSearchParams;
};

export async function buildCmsSegmentsMetadata({
	locale,
	segments
}: Omit<TRenderArgs, "searchParams">) {
	const route = await resolveAppRoute(locale, segments);
	if (!route) {
		return {};
	}
	return buildCmsRouteMetadata(route, locale);
}

export async function renderCmsSegmentsPage({
	locale,
	segments,
	searchParams
}: TRenderArgs): Promise<ReactNode> {
	setRequestLocale(locale);
	const route = await resolveAppRoute(locale, segments);
	if (!route) {
		notFound();
	}
	return renderCmsRoute(route, locale, searchParams);
}
