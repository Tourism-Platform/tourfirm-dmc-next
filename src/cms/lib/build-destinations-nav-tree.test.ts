import { describe, expect, it } from "vitest";

import { buildDestinationsNavTree } from "./build-destinations-nav-tree";

describe("buildDestinationsNavTree", () => {
	it("groups cities under regions and sorts by navOrder", () => {
		const tree = buildDestinationsNavTree(
			"destinations",
			[
				{
					id: 1,
					slug: "uzbekistan",
					title: "Uzbekistan",
					navOrder: 0
				} as never,
				{
					id: 2,
					slug: "kyrgyzstan",
					title: "Kyrgyzstan",
					navOrder: 1
				} as never
			],
			[
				{
					id: 10,
					slug: "samarkand-region",
					title: "Samarkand",
					country: 1,
					navOrder: 1
				} as never,
				{
					id: 11,
					slug: "tashkent-region",
					title: "Tashkent",
					country: 1,
					navOrder: 0
				} as never
			],
			[
				{
					id: 100,
					slug: "samarkand",
					title: "Samarkand",
					country: 1,
					region: 10,
					navOrder: 0
				} as never
			]
		);

		expect(tree.rootHref).toBe("/destinations");
		expect(tree.countries.map((country) => country.slug)).toEqual([
			"uzbekistan",
			"kyrgyzstan"
		]);
		expect(tree.countries[0]?.regions.map((region) => region.slug)).toEqual(
			["tashkent-region", "samarkand-region"]
		);
		expect(tree.countries[0]?.regions[1]?.cities[0]?.href).toBe(
			"/destinations/uzbekistan/samarkand-region/samarkand"
		);
		expect(tree.countries[1]?.regions).toEqual([]);
	});
});
