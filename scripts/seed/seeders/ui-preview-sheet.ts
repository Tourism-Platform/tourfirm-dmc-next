import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import { hasUiTextFile, loadUiTextFile } from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiPreviewSheet(payload: Payload): Promise<void> {
	console.log("Seeding ui-preview-sheet...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "preview_option_sheet.json"))) {
			console.log(
				`  ~ skip ui-preview-sheet locale ${locale} (no preview_option_sheet.json)`
			);
			continue;
		}

		const sheet = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"preview_option_sheet.json"
		);

		await updateGlobalLocale(
			payload,
			"ui-preview-sheet",
			locale,
			convertKeysDeep(sheet)
		);

		console.log(`  + ui-preview-sheet locale ${locale}`);
	}
}
