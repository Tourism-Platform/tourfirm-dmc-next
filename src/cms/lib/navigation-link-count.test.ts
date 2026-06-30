import { describe, expect, it } from "vitest";

import {
	getColumnLinkCount,
	getNavigationItemLinkCount
} from "./navigation-link-count";

describe("navigation-link-count", () => {
	it("counts leaf navigation items as one link", () => {
		expect(getNavigationItemLinkCount({ type: "page" })).toBe(1);
		expect(getNavigationItemLinkCount({ type: "custom" })).toBe(1);
	});

	it("counts group children recursively", () => {
		expect(
			getNavigationItemLinkCount({
				type: "group",
				groupItems: [
					{ type: "page" },
					{ type: "page" },
					{ type: "custom" }
				]
			})
		).toBe(3);
	});

	it("sums column items for footer labels", () => {
		expect(
			getColumnLinkCount([
				{ type: "custom" },
				{
					type: "group",
					groupItems: [{ type: "page" }, { type: "page" }]
				}
			])
		).toBe(3);
	});
});
