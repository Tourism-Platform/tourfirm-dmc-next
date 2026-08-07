import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import {
	hasUiTextFile,
	loadUiTextFile
} from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiBooking(payload: Payload): Promise<void> {
	console.log("Seeding ui-booking...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "preview_booking_page.json"))) {
			console.log(
				`  ~ skip ui-booking locale ${locale} (no preview_booking_page.json)`
			);
			continue;
		}

		const booking = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"preview_booking_page.json"
		);

		await updateGlobalLocale(
			payload,
			"ui-booking",
			locale,
			convertKeysDeep(booking)
		);

		console.log(`  + ui-booking locale ${locale}`);
	}
}
