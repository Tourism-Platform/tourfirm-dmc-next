import type { Payload } from "payload";

import { SUPPORTED_LOCALES } from "../../../config/supported-locales.js";
import { convertKeysDeep } from "../lib/convert-keys.js";
import { hasUiTextFile, loadUiTextFile } from "../lib/load-ui-text.js";
import { updateGlobalLocale } from "../lib/update-global.js";

export async function seedUiOrders(payload: Payload): Promise<void> {
	console.log("Seeding ui-orders...");

	for (const locale of SUPPORTED_LOCALES) {
		if (!(await hasUiTextFile(locale, "orders_page.json"))) {
			console.log(
				`  ~ skip ui-orders locale ${locale} (no orders_page.json)`
			);
			continue;
		}

		const orders = await loadUiTextFile<Record<string, unknown>>(
			locale,
			"orders_page.json"
		);

		await updateGlobalLocale(
			payload,
			"ui-orders",
			locale,
			convertKeysDeep(orders)
		);

		console.log(`  + ui-orders locale ${locale}`);
	}
}
