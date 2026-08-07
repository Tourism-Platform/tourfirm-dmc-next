import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiTours(payload: Payload): Promise<void> {
	console.log("Seeding ui-tours...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "tours_page.json"))) {
			console.log(`  ~ skip ui-tours locale ${locale} (no tours_page.json)`);
			continue;
		}

		const catalog = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"tours_page.json"
		);

		await updateGlobalLocale(
			payload,
			"ui-tours",
			locale,
			convertKeysDeep(catalog)
		);

		console.log(`  + ui-tours locale ${locale}`);
	}
}
