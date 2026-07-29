import { describe, expect, it } from "vitest";

import { mapInformationAreasToFooterColumns } from "./map-information-areas-to-footer-columns";

describe("mapInformationAreasToFooterColumns", () => {
	it("creates one footer column per area with hub link last", () => {
		const columns = mapInformationAreasToFooterColumns(
			{
				areas: [
					{
						key: "news-0",
						collection: "news",
						label: "News",
						hubHref: "/company/news",
						items: [
							{
								id: "1",
								slug: "office-opening",
								title: "Office opening",
								href: "/company/news/office-opening"
							}
						]
					}
				]
			},
			"View all"
		);

		expect(columns).toHaveLength(1);
		expect(columns[0]?.title).toBe("News");
		expect(columns[0]?.links.map((link) => link.href)).toEqual([
			"/company/news/office-opening",
			"/company/news"
		]);
		expect(columns[0]?.links.at(-1)?.label).toBe("View all");
	});
});
