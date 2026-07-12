import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Page, Segment } from "@/payload-types";

const mockGetDestination = vi.fn();
const mockResolveGeoRoute = vi.fn();
const mockResolveCmsRoute = vi.fn();
const mockResolveSegmentPageRoute = vi.fn();

vi.mock("@/cms/api/get-destination", () => ({
	getDestination: (...args: unknown[]) => mockGetDestination(...args)
}));

vi.mock("@/cms/routing/resolve-geo-route", () => ({
	MAX_GEO_SEGMENTS: 4,
	resolveGeoRoute: (...args: unknown[]) => mockResolveGeoRoute(...args)
}));

vi.mock("@/cms/routing/resolve-cms-route", () => ({
	resolveCmsRoute: (...args: unknown[]) => mockResolveCmsRoute(...args)
}));

vi.mock("@/cms/routing/resolve-segment-page-route", () => ({
	resolveSegmentPageRoute: (...args: unknown[]) =>
		mockResolveSegmentPageRoute(...args)
}));

const { resolveAppRoute } = await import("./resolve-app-route");

const page = { id: 1, slug: "about", title: "About" } as Page;
const segment = { id: 2, slug: "legal", title: "Legal" } as Segment;

describe("resolveAppRoute", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetDestination.mockResolvedValue({ slug: "destinations" });
	});

	it("resolves blog hub via registry", async () => {
		const route = await resolveAppRoute("en", ["blog"]);

		expect(route).toEqual({
			routeKey: "blog",
			target: { type: "collection", collection: "blog" },
			source: "collection",
			kind: "hub"
		});
	});

	it("resolves blog detail via registry", async () => {
		const route = await resolveAppRoute("en", ["blog", "post-slug"]);

		expect(route).toEqual({
			routeKey: "blog",
			target: { type: "collection", collection: "blog" },
			source: "collection",
			kind: "detail",
			slug: "post-slug"
		});
	});

	it("resolves company news hub via registry", async () => {
		const route = await resolveAppRoute("en", ["company", "news"]);

		expect(route).toEqual({
			routeKey: "company-news",
			target: { type: "collection", collection: "news" },
			source: "collection",
			kind: "hub"
		});
	});

	it("resolves team page via registry", async () => {
		const route = await resolveAppRoute("en", ["company", "team", "john"]);

		expect(route).toEqual({
			routeKey: "team",
			target: { type: "page", segment: "company", pathGroup: "team" },
			source: "cms",
			kind: "page",
			slug: "john",
			document: {}
		});
	});

	it("resolves themes detail-only via registry", async () => {
		const route = await resolveAppRoute("en", ["themes", "culture"]);

		expect(route).toEqual({
			routeKey: "themes",
			target: { type: "collection", collection: "themes" },
			source: "collection",
			kind: "detail",
			slug: "culture"
		});
	});

	it("does not resolve themes hub without hubGlobal", async () => {
		const route = await resolveAppRoute("en", ["themes"]);

		expect(route).toBeNull();
	});

	it("does not resolve italy/rome as collection", async () => {
		const route = await resolveAppRoute("en", ["italy", "rome"]);

		expect(route).toBeNull();
	});

	it("resolves root page without segment", async () => {
		mockResolveCmsRoute.mockResolvedValue({ kind: "page", document: page });

		const route = await resolveAppRoute("en", ["about"]);

		expect(route).toMatchObject({
			routeKey: "cms:about",
			target: { type: "page", segment: "root" },
			source: "cms",
			kind: "page",
			document: page
		});
		expect(mockResolveCmsRoute).toHaveBeenCalledWith("en", "about");
	});

	it("resolves segment page at two segments", async () => {
		mockResolveSegmentPageRoute.mockResolvedValue({
			kind: "segment-page",
			document: { ...page, slug: "privacy" },
			segment
		});

		const route = await resolveAppRoute("en", ["legal", "privacy"]);

		expect(route?.source).toBe("cms");
		expect(route).toMatchObject({
			routeKey: "segment:legal/privacy",
			target: { type: "page", segment: "legal" },
			kind: "segment-page",
			segment: { slug: "legal" }
		});
		expect(mockResolveSegmentPageRoute).toHaveBeenCalledWith(
			"en",
			"legal",
			"privacy"
		);
	});

	it("returns null when segment page is not found", async () => {
		mockResolveSegmentPageRoute.mockResolvedValue(null);

		const route = await resolveAppRoute("en", ["legal", "missing"]);

		expect(route).toBeNull();
	});

	it("prefers geo route when first segment is destination slug", async () => {
		mockResolveGeoRoute.mockResolvedValue({
			kind: "country",
			document: { slug: "uzbekistan", seo: {} },
			path: "/destinations/uzbekistan"
		});

		const route = await resolveAppRoute("en", [
			"destinations",
			"uzbekistan"
		]);

		expect(route?.source).toBe("geo");
		expect(route).toMatchObject({
			routeKey: "geo:country:uzbekistan",
			target: { type: "geo" }
		});
		expect(mockResolveSegmentPageRoute).not.toHaveBeenCalled();
	});

	it("does not fall back to single-segment resolver for two segments", async () => {
		mockResolveSegmentPageRoute.mockResolvedValue(null);

		await resolveAppRoute("en", ["legal", "privacy"]);

		expect(mockResolveCmsRoute).not.toHaveBeenCalled();
	});
});
