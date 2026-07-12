import { describe, expect, it } from "vitest";

import {
	COLLECTION_ROUTE_REGISTRY,
	matchRegistryRoute
} from "./collection-route.registry";
import { hasHubGlobal } from "./route-runtime.registry";

describe("matchRegistryRoute", () => {
	it("matches blog hub", () => {
		const match = matchRegistryRoute(["blog"], hasHubGlobal);

		expect(match).toEqual({
			routeKey: "blog",
			kind: "hub",
			target: { type: "collection", collection: "blog" }
		});
	});

	it("matches blog detail", () => {
		const match = matchRegistryRoute(["blog", "post-slug"], hasHubGlobal);

		expect(match).toEqual({
			routeKey: "blog",
			kind: "detail",
			slug: "post-slug",
			target: { type: "collection", collection: "blog" }
		});
	});

	it("matches company news hub", () => {
		const match = matchRegistryRoute(["company", "news"], hasHubGlobal);

		expect(match).toEqual({
			routeKey: "company-news",
			kind: "hub",
			target: { type: "collection", collection: "news" }
		});
	});

	it("matches company news detail", () => {
		const match = matchRegistryRoute(
			["company", "news", "article-slug"],
			hasHubGlobal
		);

		expect(match).toEqual({
			routeKey: "company-news",
			kind: "detail",
			slug: "article-slug",
			target: { type: "collection", collection: "news" }
		});
	});

	it("matches team page-backed detail", () => {
		const match = matchRegistryRoute(
			["company", "team", "john"],
			hasHubGlobal
		);

		expect(match).toEqual({
			routeKey: "team",
			kind: "page",
			slug: "john",
			target: { type: "page", segment: "company", pathGroup: "team" }
		});
	});

	it("matches themes detail-only", () => {
		const match = matchRegistryRoute(["themes", "culture"], hasHubGlobal);

		expect(match).toEqual({
			routeKey: "themes",
			kind: "detail",
			slug: "culture",
			target: { type: "collection", collection: "themes" }
		});
	});

	it("does not match themes hub without hubGlobal", () => {
		const match = matchRegistryRoute(["themes"], hasHubGlobal);

		expect(match).toBeNull();
	});

	it("does not match italy/rome as collection", () => {
		const match = matchRegistryRoute(["italy", "rome"], hasHubGlobal);

		expect(match).toBeNull();
	});

	it("registers all planned discovery routes", () => {
		const keys = COLLECTION_ROUTE_REGISTRY.map((entry) => entry.key);

		expect(keys).toEqual(
			expect.arrayContaining([
				"blog",
				"routes",
				"experiences",
				"themes",
				"company-news",
				"company-trade-fairs",
				"team"
			])
		);
	});
});
