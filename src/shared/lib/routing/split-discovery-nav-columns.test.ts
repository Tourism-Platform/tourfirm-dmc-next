import { describe, expect, it } from "vitest";

import {
	resolveDiscoveryNavColumnCount,
	splitDiscoveryNavColumns
} from "./split-discovery-nav-columns";

function makeItems(count: number) {
	return Array.from({ length: count }, (_, index) => ({
		id: String(index + 1),
		slug: `item-${index + 1}`,
		title: `Item ${index + 1}`,
		href: `/items/item-${index + 1}`
	}));
}

describe("resolveDiscoveryNavColumnCount", () => {
	it("returns 1 for up to 5 items", () => {
		expect(resolveDiscoveryNavColumnCount(1)).toBe(1);
		expect(resolveDiscoveryNavColumnCount(5)).toBe(1);
	});

	it("returns 2 for 6 to 10 items", () => {
		expect(resolveDiscoveryNavColumnCount(6)).toBe(2);
		expect(resolveDiscoveryNavColumnCount(10)).toBe(2);
	});

	it("returns 3 for 11 or more items", () => {
		expect(resolveDiscoveryNavColumnCount(11)).toBe(3);
		expect(resolveDiscoveryNavColumnCount(16)).toBe(3);
	});
});

describe("splitDiscoveryNavColumns", () => {
	it("splits 16 items into 6 + 6 + 4", () => {
		const columns = splitDiscoveryNavColumns(makeItems(16));

		expect(columns).toHaveLength(3);
		expect(columns[0]).toHaveLength(6);
		expect(columns[1]).toHaveLength(6);
		expect(columns[2]).toHaveLength(4);
	});

	it("returns a single column for 5 items", () => {
		const columns = splitDiscoveryNavColumns(makeItems(5));

		expect(columns).toHaveLength(1);
		expect(columns[0]).toHaveLength(5);
	});

	it("splits 8 items into two equal columns", () => {
		const columns = splitDiscoveryNavColumns(makeItems(8));

		expect(columns).toHaveLength(2);
		expect(columns[0]).toHaveLength(4);
		expect(columns[1]).toHaveLength(4);
	});
});
