import { describe, expect, it } from "vitest";

import {
	buildPageDomainWhere,
	getPageDomain,
	matchesPageDomain
} from "./page-domains";
import type { Page, Segment } from "@/payload-types";

const legalSegment = { id: 1, slug: "legal", title: "Legal" } as Segment;
const companySegment = { id: 2, slug: "company", title: "Company" } as Segment;

const legalPage = {
	id: 1,
	slug: "privacy",
	segment: legalSegment,
	pathGroup: null
} as Page;

const teamPage = {
	id: 2,
	slug: "sodik-begmatov",
	segment: companySegment,
	pathGroup: "team"
} as Page;

const aboutPage = {
	id: 3,
	slug: "about",
	segment: companySegment,
	pathGroup: null
} as Page;

describe("buildPageDomainWhere", () => {
	it("builds legal domain filter", () => {
		expect(buildPageDomainWhere("legal")).toEqual({
			and: [
				{
					"segment.slug": {
						equals: "legal"
					}
				},
				{
					pathGroup: {
						exists: false
					}
				}
			]
		});
	});

	it("builds team domain filter", () => {
		expect(buildPageDomainWhere("team")).toEqual({
			and: [
				{
					"segment.slug": {
						equals: "company"
					}
				},
				{
					pathGroup: {
						equals: "team"
					}
				}
			]
		});
	});
});

describe("getPageDomain", () => {
	it("returns legal for legal pages", () => {
		expect(getPageDomain(legalPage)).toBe("legal");
		expect(matchesPageDomain(legalPage, "legal")).toBe(true);
	});

	it("returns team for team member pages", () => {
		expect(getPageDomain(teamPage)).toBe("team");
		expect(matchesPageDomain(teamPage, "team")).toBe(true);
	});

	it("returns null for regular company pages", () => {
		expect(getPageDomain(aboutPage)).toBeNull();
		expect(matchesPageDomain(aboutPage, "legal")).toBe(false);
		expect(matchesPageDomain(aboutPage, "team")).toBe(false);
	});
});
