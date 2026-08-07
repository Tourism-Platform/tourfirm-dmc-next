import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiLogin(payload: Payload): Promise<void> {
	console.log("Seeding ui-login...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "login_page.json"))) {
			console.log(`  ~ skip ui-login locale ${locale} (no login_page.json)`);
			continue;
		}

		const login = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"login_page.json"
		);

		await updateGlobalLocale(payload, "ui-login", locale, convertKeysDeep(login));

		console.log(`  + ui-login locale ${locale}`);
	}
}
