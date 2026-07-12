import type { CollectionConfig } from "payload";

import { ADMIN_COLLECTION_NAVIGATION } from "../admin/admin-navigation.config";
import { groupCollections } from "../admin/group-collections";

import { Attractions } from "./attractions";
import { Badges } from "./badges";
import { Blog } from "./blog";
import { Cities } from "./cities";
import { Countries } from "./countries";
import { Experiences } from "./experiences";
import { MapPoints } from "./map-points";
import { Media } from "./media";
import { News } from "./news";
import { Pages } from "./pages";
import { Regions } from "./regions";
import { Routes } from "./routes";
import { Segments } from "./segments";
import { Themes } from "./themes";
import { TradeFairs } from "./trade-fairs";
import { Users } from "./users";

const rawCollections: CollectionConfig[] = [
	Countries,
	Regions,
	Cities,
	Attractions,
	Routes,
	MapPoints,
	Experiences,
	TradeFairs,
	Blog,
	News,
	Pages,
	Segments,
	Themes,
	Badges,
	Media,
	Users
];

if (process.env.NODE_ENV === "development") {
	const configuredSlugs = new Set(
		ADMIN_COLLECTION_NAVIGATION.flatMap((section) => section.items)
	);
	const projectSlugs = new Set(rawCollections.map((c) => c.slug));

	for (const slug of projectSlugs) {
		if (!configuredSlugs.has(slug)) {
			console.warn(
				`[admin-navigation] Collection "${slug}" is not listed in ADMIN_COLLECTION_NAVIGATION`
			);
		}
	}

	for (const slug of configuredSlugs) {
		if (!projectSlugs.has(slug)) {
			console.warn(
				`[admin-navigation] ADMIN_COLLECTION_NAVIGATION references unknown slug "${slug}"`
			);
		}
	}
}

export const collections = groupCollections(
	rawCollections,
	ADMIN_COLLECTION_NAVIGATION
);
