import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "../lib/load-ui-text.js";
import { buildPreviewLabelsFromOptions } from "../lib/preview-labels.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiPreview(payload: Payload): Promise<void> {
	console.log("Seeding ui-preview...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "preview_tour_page.json"))) {
			console.log(`  ~ skip ui-preview locale ${locale} (no preview_tour_page.json)`);
			continue;
		}

		const previewTour = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"preview_tour_page.json"
		);
		const previewOption = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"preview_option_page.json"
		);

		let labels: Record<string, unknown> = { languages: {}, pickup: {} };

		if (await hasUiTextFile(locale, "options.json")) {
			const options = await loadUiTextFile<Record<string, unknown>>(
				locale,
				"options.json"
			);
			labels = buildPreviewLabelsFromOptions(options);
		}

		await updateGlobalLocale(payload, "ui-preview", locale, {
			tour: convertKeysDeep(previewTour),
			option: convertKeysDeep(previewOption),
			labels
		});

		console.log(`  + ui-preview locale ${locale}`);
	}
}
