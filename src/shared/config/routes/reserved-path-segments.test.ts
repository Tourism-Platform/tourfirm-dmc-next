import { describe, expect, it } from "vitest";

import {
	isBlockedGeoEntitySlug,
	isReservedRootPageSlug,
	isReservedSegmentSlug
} from "./reserved-path-segments";

describe("reserved path segments", () => {
	it("blocks company as root page slug (discovery root)", () => {
		expect(isReservedRootPageSlug("company")).toBe(true);
	});

	it("allows company as CMS segment slug", () => {
		expect(isReservedSegmentSlug("company")).toBe(false);
	});

	it("blocks admin for both root pages and segments", () => {
		expect(isReservedRootPageSlug("admin")).toBe(true);
		expect(isReservedSegmentSlug("admin")).toBe(true);
	});

	it("blocks blog as geo entity slug via discovery root", () => {
		expect(isBlockedGeoEntitySlug("blog")).toBe(true);
	});
});
