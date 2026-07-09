import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { ExperiencesHub } from "@/payload-types";

export const getExperiencesHub = cache(
	async (locale: TypedLocale): Promise<ExperiencesHub | null> => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: "experiences-hub",
				locale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
