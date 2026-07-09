import type { CollectionConfig, GlobalConfig } from "payload";

import type { TAdminNavSection } from "./admin-navigation.config";

function findGroupLabel(
	slug: string,
	sections: TAdminNavSection[]
): string | false {
	const section = sections.find((s) => s.items.includes(slug));

	return section?.label ?? false;
}

export function groupCollections(
	collections: CollectionConfig[],
	sections: TAdminNavSection[]
): CollectionConfig[] {
	for (const collection of collections) {
		collection.admin ??= {};
		collection.admin.group = findGroupLabel(collection.slug, sections);
	}

	return collections;
}

export function groupGlobals(
	globals: GlobalConfig[],
	sections: TAdminNavSection[]
): GlobalConfig[] {
	for (const global of globals) {
		global.admin ??= {};
		global.admin.group = findGroupLabel(global.slug, sections);
	}

	return globals;
}
