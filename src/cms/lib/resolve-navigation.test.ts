import { describe, expect, it, vi } from "vitest";

import type { Footer, Header, Page } from "@/payload-types";

vi.mock("server-only", () => ({}));

const { resolveFooterNavigation, resolveHeaderNavigation } =
	await import("./resolve-navigation");

const aboutPage = {
	id: 10,
	slug: "about",
	title: "About",
	segment: { slug: "company" }
} as Page;

const faqPage = {
	id: 101,
	slug: "faq",
	title: "FAQ",
	segment: { slug: "help" }
} as Page;

describe("resolveHeaderNavigation", () => {
	it("preserves navItems array order", () => {
		const navItems = [
			{
				id: "help",
				type: "group" as const,
				label: "Help",
				icon: "life-buoy",
				groupItems: [
					{
						id: "faq",
						type: "page" as const,
						label: "FAQ menu",
						description: "  Frequently asked questions  ",
						icon: "help-circle",
						page: faqPage
					}
				]
			},
			{
				id: "company",
				type: "group" as const,
				label: "Company",
				icon: "building-2",
				groupItems: []
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems);

		expect(result.map((item) => item.label)).toEqual(["Help", "Company"]);
	});

	it("uses page.title when label is empty", () => {
		const navItems = [
			{
				id: "about",
				type: "page" as const,
				label: "",
				page: aboutPage
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems);

		expect(result[0]?.label).toBe("About");
	});

	it("maps description and icon from group child nav items", () => {
		const navItems = [
			{
				id: "help",
				type: "group" as const,
				label: "Help",
				groupItems: [
					{
						id: "faq",
						type: "page" as const,
						label: "FAQ menu",
						description: "  Frequently asked questions  ",
						icon: "help-circle",
						page: faqPage
					},
					{
						id: "contact",
						type: "page" as const,
						label: "Contact",
						description: "",
						page: {
							id: 102,
							slug: "contact",
							title: "Contact",
							segment: { slug: "help" }
						} as Page
					}
				]
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems);

		expect(result[0]?.sections[0]?.items[0]?.description).toBe(
			"Frequently asked questions"
		);
		expect(result[0]?.sections[0]?.items[0]?.icon).toBe("help-circle");
		expect(result[0]?.sections[0]?.items[1]?.description).toBeUndefined();
	});

	it("assigns routes-mega variant for route icon and /routes href", () => {
		const navItems = [
			{
				id: "routes",
				type: "custom" as const,
				label: "Routes",
				icon: "route",
				href: "/routes"
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems);

		expect(result[0]?.variant).toBe("routes-mega");
		expect(result[0]?.href).toBe("/routes");
	});

	it("assigns experiences-mega variant for heart-handshake icon and /experiences href", () => {
		const navItems = [
			{
				id: "experiences",
				type: "custom" as const,
				label: "Experiences",
				icon: "heart-handshake",
				href: "/experiences"
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems);

		expect(result[0]?.variant).toBe("experiences-mega");
		expect(result[0]?.href).toBe("/experiences");
	});

	it("assigns destinations-mega variant when destination slug matches", () => {
		const navItems = [
			{
				id: "destinations",
				type: "custom" as const,
				label: "Destinations",
				icon: "map-pin",
				href: "/destinations"
			}
		] as NonNullable<Header["navItems"]>;

		const result = resolveHeaderNavigation("en", navItems, "destinations");

		expect(result[0]?.variant).toBe("destinations-mega");
	});
});

describe("resolveFooterNavigation", () => {
	it("preserves footer columns and flattens group items", () => {
		const columns = [
			{
				id: "policies",
				title: "Policies",
				items: [
					{
						id: "legal",
						type: "group" as const,
						label: "Policies",
						groupItems: [
							{
								id: "terms",
								type: "page" as const,
								label: "Terms",
								page: {
									id: 201,
									slug: "terms",
									title: "Terms",
									segment: { slug: "legal" }
								} as Page
							}
						]
					}
				]
			},
			{
				id: "company",
				title: "Company",
				items: [
					{
						id: "catalog",
						type: "custom" as const,
						label: "Catalog",
						href: "/catalog"
					},
					{
						id: "about",
						type: "page" as const,
						label: "",
						page: aboutPage
					}
				]
			}
		] as NonNullable<Footer["columns"]>;

		const result = resolveFooterNavigation("en", columns);

		expect(result.map((column) => column.title)).toEqual([
			"Policies",
			"Company"
		]);
		expect(result[0]?.links.map((link) => link.label)).toEqual(["Terms"]);
		expect(result[1]?.links.map((link) => link.label)).toEqual([
			"Catalog",
			"About"
		]);
	});
});
