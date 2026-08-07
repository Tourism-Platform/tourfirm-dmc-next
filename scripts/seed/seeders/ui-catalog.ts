import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiCatalog(payload: Payload): Promise<void> {
	console.log("Seeding ui-catalog...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "catalog_page.json"))) {
			console.log(`  ~ skip ui-catalog locale ${locale} (no catalog_page.json)`);
			continue;
		}

		const catalog = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"catalog_page.json"
		);

		await updateGlobalLocale(
			payload,
			"ui-catalog",
			locale,
			convertKeysDeep(catalog)
		);

		console.log(`  + ui-catalog locale ${locale}`);
	}
}
