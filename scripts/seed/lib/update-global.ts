import type { Payload } from "payload";

import { SEED_OP_OPTS } from "./constants.js";

export async function updateGlobalLocale(
	payload: Payload,
	slug: string,
	locale: string,
	data: Record<string, unknown>
): Promise<void> {
	let nextData = data;

	if (slug === "footer" || slug === "header") {
		const existing = await payload.findGlobal({
			slug,
			locale,
			depth: 0,
			...SEED_OP_OPTS
		});

		if (slug === "footer" && Array.isArray(existing?.columns)) {
			nextData = {
				...data,
				columns: existing.columns
			};
		}

		if (slug === "header") {
			nextData = {
				...data,
				...(existing?.logo != null ? { logo: existing.logo } : {}),
				...(Array.isArray(existing?.navItems)
					? { navItems: existing.navItems }
					: {}),
				...(Array.isArray(existing?.informationAreas)
					? { informationAreas: existing.informationAreas }
					: {}),
				...(Array.isArray(existing?.userMenuItems)
					? { userMenuItems: existing.userMenuItems }
					: {})
			};
		}
	}

	await payload.updateGlobal({
		slug,
		data: nextData,
		locale,
		draft: false,
		...SEED_OP_OPTS
	});
}
