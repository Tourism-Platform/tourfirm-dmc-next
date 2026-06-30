import { describe, expect, it } from "vitest";

import { getCmsRoutePath } from "./get-cms-route-path";
import type { TCmsRoute } from "./resolve-cms-route";
import type { Page, Segment } from "@/payload-types";

describe("getCmsRoutePath", () => {
	it("builds root page path", () => {
		const route = {
			kind: "page",
			document: { slug: "about" } as Page
		} satisfies TCmsRoute;

		expect(getCmsRoutePath(route)).toBe("/about");
	});

	it("builds segment page path", () => {
		const route = {
			kind: "segment-page",
			segment: { slug: "legal" } as Segment,
			document: { slug: "privacy" } as Page
		} satisfies TCmsRoute;

		expect(getCmsRoutePath(route)).toBe("/legal/privacy");
	});
});
