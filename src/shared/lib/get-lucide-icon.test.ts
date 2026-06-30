import { HelpCircle, icons } from "lucide-react";
import { describe, expect, it } from "vitest";

import {
	getLucideIcon,
	resolveLucideIconKey,
	toPascalCase
} from "./get-lucide-icon";

describe("toPascalCase", () => {
	it("converts kebab-case", () => {
		expect(toPascalCase("map-pin")).toBe("MapPin");
		expect(toPascalCase("life-buoy")).toBe("LifeBuoy");
	});

	it("preserves PascalCase", () => {
		expect(toPascalCase("Compass")).toBe("Compass");
		expect(toPascalCase("AlarmClock")).toBe("AlarmClock");
	});
});

describe("resolveLucideIconKey", () => {
	it.each([
		["Compass", "Compass"],
		["AlarmClock", "AlarmClock"],
		["compass", "Compass"],
		["map-pin", "MapPin"],
		["life-buoy", "LifeBuoy"],
		["map_pin", "MapPin"]
	])("resolves %s to %s", (input, expected) => {
		expect(resolveLucideIconKey(input)).toBe(expected);
		expect(expected in icons).toBe(true);
	});

	it("returns null for unknown icons", () => {
		expect(resolveLucideIconKey("not-a-real-icon")).toBeNull();
		expect(resolveLucideIconKey("")).toBeNull();
	});
});

describe("getLucideIcon", () => {
	it("returns component for any supported string format", () => {
		expect(getLucideIcon("Compass")).toBe(icons.Compass);
		expect(getLucideIcon("compass")).toBe(icons.Compass);
		expect(getLucideIcon("map-pin")).toBe(icons.MapPin);
	});

	it("returns fallback for missing name", () => {
		expect(getLucideIcon(undefined)).toBe(HelpCircle);
		expect(getLucideIcon("")).toBe(HelpCircle);
	});
});
