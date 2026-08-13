import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { buildGeoBreadcrumbs } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { loadUiContent } from "@/shared/ui-content/server";

import { Cms } from "@/widgets/cms";
import { Destinations } from "@/widgets/destinations";

import { CmsPage } from "@/page/cms";

import type { TAppRoute } from "./app-route.types";
import { buildWidgetModels } from "./build-widget-models";
import { createRenderContext } from "./create-render-context";
import type { TGeoRoute } from "./geo-route.types";
import { loadRouteData } from "./load-route-data";
import { renderWidgets } from "./render-widgets";
import { mapCmsBlocks } from "@/cms/lib";

function isGeoPageKind(
	kind: TGeoRoute["kind"]
): kind is "country" | "region" | "city" | "attraction" {
	return (
		kind === "country" ||
		kind === "region" ||
		kind === "city" ||
		kind === "attraction"
	);
}
export function isManagedDiscoveryRoute(route: TAppRoute): boolean {
	return (
		route.source === "collection" ||
		(route.source === "cms" &&
			route.kind === "page" &&
			route.routeKey === "team")
	);
}
export async function buildCmsRouteMetadata(
	route: TAppRoute,
	locale: string
): Promise<Metadata> {
	if (route.source === "geo" && isGeoPageKind(route.kind)) {
		return createCmsPageMetadata({
			seo: route.document.seo ?? {},
			locale,
			path: route.path
		});
	}
	// Hub/detail SEO comes from the CMS document, not list query filters.
	if (isManagedDiscoveryRoute(route)) {
		const { data, entityResult } = await loadRouteData(route, locale);
		const ctx = createRenderContext({
			route,
			data,
			entityResult,
			widgetModels: []
		});
		return createCmsPageMetadata({
			seo: ctx.metadata.seo,
			locale,
			path: ctx.metadata.path
		});
	}
	if (route.source === "cms") {
		return createCmsPageMetadata({
			seo: route.document.seo ?? {},
			locale,
			path: `/${route.document.slug ?? ""}`
		});
	}
	return {};
}
export async function renderCmsRoute(
	route: TAppRoute,
	locale: string,
	searchParams?: {
		page?: string;
		theme?: string;
		country?: string;
	}
) {
	setRequestLocale(locale);
	if (isManagedDiscoveryRoute(route)) {
		const { data, entityResult } = await loadRouteData(
			route,
			locale,
			searchParams
		);
		const widgetModels = buildWidgetModels(route, data, entityResult);
		const ctx = createRenderContext({
			route,
			data,
			entityResult,
			widgetModels
		});
		const widgets = await renderWidgets(
			ctx.widgetModels,
			ctx.runtime,
			locale
		);
		return (
			<>
				{widgets.beforeCms}
				<Cms
					sections={ctx.sections}
					breadcrumbItems={ctx.breadcrumbs}
				/>
				{widgets.afterCms}
			</>
		);
	}
	if (route.source === "geo") {
		const sections = await mapCmsBlocks(route.document.blocks);
		const uiContent = await loadUiContent(locale);
		const breadcrumbItems = buildGeoBreadcrumbs(
			route,
			uiContent.discovery.geoBreadcrumbLabel
		);
		return <Cms sections={sections} breadcrumbItems={breadcrumbItems} />;
	}
	if (route.source === "cms" && route.kind === "destination") {
		const sections = await mapCmsBlocks(route.document.blocks);
		return <Destinations sections={sections} />;
	}
	if (route.source === "cms") {
		const sections = await mapCmsBlocks(route.document.blocks);
		return <CmsPage sections={sections} />;
	}
	notFound();
}
