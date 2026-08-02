import { describe, expect, it } from "vitest";

import { mapDiscoveryNavToFooterColumn } from "./map-discovery-nav-to-footer-column";

describe("mapDiscoveryNavToFooterColumn", () => {
	it("creates footer column with hub link last", () => {
		const column = mapDiscoveryNavToFooterColumn(
			{
				rootHref: "/routes",
				items: [
					{
						id: "1",
						slug: "silk-road",
						title: "Silk Road",
						href: "/routes/silk-road"
					}
				]
			},
			"routes-footer",
			"Tailor-Made Trips",
			"View all"
		);

		expect(column?.title).toBe("Tailor-Made Trips");
		expect(column?.links.map((link) => link.href)).toEqual([
			"/routes/silk-road",
			"/routes"
		]);
		expect(column?.links.at(-1)?.label).toBe("View all");
	});

	it("returns null when there are no items", () => {
		expect(
			mapDiscoveryNavToFooterColumn(
				{ rootHref: "/routes", items: [] },
				"routes-footer",
				"Tailor-Made Trips",
				"View all"
			)
		).toBeNull();
	});
});
