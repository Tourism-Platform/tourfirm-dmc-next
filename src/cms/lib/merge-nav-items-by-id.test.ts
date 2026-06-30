import { describe, expect, it } from "vitest";

import {
	mergeFooterColumnsById,
	mergeNavItemsById
} from "./merge-nav-items-by-id";

describe("mergeNavItemsById", () => {
	it("preserves existing array item ids by index", () => {
		const existing = [
			{ id: "nav-1", type: "custom", label: "EN", href: "/destinations" },
			{
				id: "nav-2",
				type: "group",
				label: "EN group",
				groupItems: [{ id: "child-1", type: "page", label: "Child EN" }]
			}
		];

		const localized = [
			{ type: "custom", label: "RU", href: "/destinations" },
			{
				type: "group",
				label: "RU group",
				groupItems: [{ type: "page", label: "Child RU" }]
			}
		];

		const result = mergeNavItemsById(existing, localized);

		expect(result[0]?.id).toBe("nav-1");
		expect(result[0]?.label).toBe("RU");
		expect(result[1]?.id).toBe("nav-2");
		expect(result[1]?.groupItems).toEqual([
			{ id: "child-1", type: "page", label: "Child RU" }
		]);
	});

	it("returns localized items when there is no existing structure", () => {
		const localized = [{ type: "custom", label: "Destinations" }];

		expect(mergeNavItemsById(undefined, localized)).toEqual(localized);
	});
});

describe("mergeFooterColumnsById", () => {
	it("preserves column and nested item ids", () => {
		const existing = [
			{
				id: "col-1",
				title: "Company EN",
				items: [{ id: "item-1", type: "custom", label: "Catalog EN" }]
			}
		];

		const localized = [
			{
				title: "Company RU",
				items: [{ type: "custom", label: "Catalog RU" }]
			}
		];

		const result = mergeFooterColumnsById(existing, localized);

		expect(result[0]?.id).toBe("col-1");
		expect(result[0]?.title).toBe("Company RU");
		expect(result[0]?.items).toEqual([
			{ id: "item-1", type: "custom", label: "Catalog RU" }
		]);
	});
});
