import { describe, expect, it } from "vitest";

import { mapExperiencesNavToFooterColumn } from "./map-experiences-nav-to-footer-column";

describe("mapExperiencesNavToFooterColumn", () => {
	it("creates footer column with hub link last", () => {
		const column = mapExperiencesNavToFooterColumn(
			{
				rootHref: "/experiences",
				items: [
					{
						id: "1",
						slug: "silk-road",
						title: "Silk Road",
						href: "/experiences/silk-road"
					}
				]
			},
			"Experiences",
			"View all"
		);

		expect(column?.title).toBe("Experiences");
		expect(column?.links.map((link) => link.href)).toEqual([
			"/experiences/silk-road",
			"/experiences"
		]);
		expect(column?.links.at(-1)?.label).toBe("View all");
	});

	it("returns null when there are no items", () => {
		expect(
			mapExperiencesNavToFooterColumn(
				{ rootHref: "/experiences", items: [] },
				"Experiences",
				"View all"
			)
		).toBeNull();
	});
});
