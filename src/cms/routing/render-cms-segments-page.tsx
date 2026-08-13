import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { auditSpan, withAuditContext } from "@/cms/perf/audit-span";
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
	return withAuditContext(
		{ phase: "metadata", url: `/${locale}/${segments.join("/")}` },
		async () => {
			const route = await auditSpan(
				"resolveAppRoute",
				{ locale, segments: segments.join("/"), caller: "metadata" },
				() => resolveAppRoute(locale, segments)
			);
			if (!route) {
				return {};
			}
			return auditSpan(
				"buildCmsRouteMetadata",
				{ locale, routeKey: route.routeKey },
				() => buildCmsRouteMetadata(route, locale)
			);
		}
	);
}

export async function renderCmsSegmentsPage({
	locale,
	segments,
	searchParams
}: TRenderArgs): Promise<ReactNode> {
	return withAuditContext(
		{ phase: "page", url: `/${locale}/${segments.join("/")}` },
		async () => {
			setRequestLocale(locale);
			const route = await auditSpan(
				"resolveAppRoute",
				{ locale, segments: segments.join("/"), caller: "page" },
				() => resolveAppRoute(locale, segments)
			);
			if (!route) {
				notFound();
			}
			return auditSpan(
				"renderCmsRoute",
				{ locale, routeKey: route.routeKey, kind: route.kind },
				() => renderCmsRoute(route, locale, searchParams)
			);
		}
	);
}
