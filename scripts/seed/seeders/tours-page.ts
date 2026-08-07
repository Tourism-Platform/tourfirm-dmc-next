import fs from "node:fs/promises";

import type { Payload } from "payload";
import type { TypedLocale } from "payload";
import { parse as parseYaml } from "yaml";

import { CATALOG_PAGE_FILE } from "../lib/paths.js";
import { updateGlobalLocale } from "../lib/update-global.js";

const LOCALES: TypedLocale[] = ["en", "ru", "uz"];

type TCatalogSeedFile = Record<
	string,
	{
		seo?: Record<string, unknown>;
		blocks?: unknown[];
	}
>;

export async function seedToursPage(payload: Payload): Promise<void> {
	console.log("Seeding tours page...");

	const raw = await fs.readFile(CATALOG_PAGE_FILE, "utf8");
	const data = parseYaml(raw) as TCatalogSeedFile;

	for (const locale of LOCALES) {
		const localeData = data[locale];

		if (!localeData) {
			console.log(`  ~ skip tours locale ${locale}`);
			continue;
		}

		await updateGlobalLocale(payload, "tours", locale, {
			seo: localeData.seo ?? {},
			blocks: localeData.blocks ?? []
		});

		console.log(`  + tours locale ${locale}`);
	}
}
