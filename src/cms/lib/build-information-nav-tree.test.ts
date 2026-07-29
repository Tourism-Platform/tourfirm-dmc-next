import { describe, expect, it } from "vitest";

import {
	buildInformationNavArea,
	buildInformationNavTree,
	getInformationAreaHubHref,
	getInformationDocHref,
	resolveInformationAreaLabel
} from "./build-information-nav-tree";

describe("build-information-nav-tree", () => {
	it("resolves hub and detail hrefs per collection", () => {
		expect(getInformationAreaHubHref("news")).toBe("/company/news");
		expect(getInformationAreaHubHref("blog")).toBe("/blog");
		expect(getInformationAreaHubHref("trade-fairs")).toBe(
			"/company/trade-fairs"
		);
		expect(getInformationDocHref("news", "office-opening")).toBe(
			"/company/news/office-opening"
		);
		expect(getInformationDocHref("blog", "silk-road-notes")).toBe(
			"/blog/silk-road-notes"
		);
		expect(getInformationDocHref("trade-fairs", "itb-berlin-2025")).toBe(
			"/company/trade-fairs/itb-berlin-2025"
		);
	});

	it("uses override label or default", () => {
		expect(resolveInformationAreaLabel("blog", "  Journal  ")).toBe(
			"Journal"
		);
		expect(resolveInformationAreaLabel("blog", "")).toBe("Blog");
		expect(resolveInformationAreaLabel("news")).toBe("News");
	});

	it("builds areas with mapped items", () => {
		const area = buildInformationNavArea({
			key: "news-0",
			collection: "news",
			label: "News",
			docs: [
				{
					id: 1,
					slug: "office-opening",
					title: "Office opening"
				}
			]
		});

		expect(area.hubHref).toBe("/company/news");
		expect(area.items).toEqual([
			{
				id: "1",
				slug: "office-opening",
				title: "Office opening",
				href: "/company/news/office-opening"
			}
		]);

		expect(buildInformationNavTree([area]).areas).toHaveLength(1);
	});
});
