import fs from "node:fs/promises";

import type { Payload } from "payload";
import { parse as parseYaml } from "yaml";

import { SEED_OP_OPTS } from "../lib/constants.js";
import { CATALOG_PAGE_FILE } from "../lib/paths.js";

const LOCALES = ["en", "ru", "uz"] as const;

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

		await payload.updateGlobal({
			slug: "tours",
			data: {
				seo: localeData.seo ?? {},
				blocks: localeData.blocks ?? []
			},
			locale,
			...SEED_OP_OPTS
		});

		console.log(`  + tours locale ${locale}`);
	}
}
