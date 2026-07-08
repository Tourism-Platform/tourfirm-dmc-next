import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Page, Segment } from "@/payload-types";

const mockGetDestination = vi.fn();
const mockResolveGeoRoute = vi.fn();
const mockResolveCmsRoute = vi.fn();
const mockResolveSegmentPageRoute = vi.fn();
const mockResolveGroupedSegmentPageRoute = vi.fn();

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

vi.mock("@/cms/routing/resolve-grouped-segment-page-route", () => ({
	resolveGroupedSegmentPageRoute: (...args: unknown[]) =>
		mockResolveGroupedSegmentPageRoute(...args)
}));

const { resolveAppRoute } = await import("./resolve-app-route");

const page = { id: 1, slug: "about", title: "About" } as Page;
const segment = { id: 2, slug: "legal", title: "Legal" } as Segment;

describe("resolveAppRoute", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetDestination.mockResolvedValue({ slug: "destinations" });
	});

	it("resolves root page without segment", async () => {
		mockResolveCmsRoute.mockResolvedValue({ kind: "page", document: page });

		const route = await resolveAppRoute("en", ["about"]);

		expect(route).toEqual({
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
			document: {},
			path: "/destinations/uzbekistan"
		});

		const route = await resolveAppRoute("en", [
			"destinations",
			"uzbekistan"
		]);

		expect(route?.source).toBe("geo");
		expect(mockResolveSegmentPageRoute).not.toHaveBeenCalled();
	});

	it("does not fall back to single-segment resolver for two segments", async () => {
		mockResolveSegmentPageRoute.mockResolvedValue(null);

		await resolveAppRoute("en", ["legal", "privacy"]);

		expect(mockResolveCmsRoute).not.toHaveBeenCalled();
	});

	it("resolves grouped segment page at three segments", async () => {
		mockResolveGroupedSegmentPageRoute.mockResolvedValue({
			kind: "segment-page",
			document: { ...page, slug: "sodik-begmatov", pathGroup: "team" },
			segment: { id: 3, slug: "company", title: "Company" }
		});

		const route = await resolveAppRoute("en", [
			"company",
			"team",
			"sodik-begmatov"
		]);

		expect(route?.source).toBe("cms");
		expect(route).toMatchObject({
			kind: "segment-page",
			segment: { slug: "company" }
		});
		expect(mockResolveGroupedSegmentPageRoute).toHaveBeenCalledWith(
			"en",
			"company",
			"team",
			"sodik-begmatov"
		);
	});

	it("returns null when grouped segment page is not found", async () => {
		mockResolveGroupedSegmentPageRoute.mockResolvedValue(null);

		const route = await resolveAppRoute("en", [
			"company",
			"team",
			"missing"
		]);

		expect(route).toBeNull();
		expect(mockResolveSegmentPageRoute).not.toHaveBeenCalled();
	});
});
