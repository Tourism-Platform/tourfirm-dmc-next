import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { ExperiencesHub } from "@/payload-types";

async function fetchExperiencesHub(
	locale: TypedLocale
): Promise<ExperiencesHub | null> {
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

const getCachedExperiencesHub = unstable_cache(
	fetchExperiencesHub,
	["experiences-hub"],
	{ revalidate: 60 }
);

export const getExperiencesHub = cache(
	async (locale: TypedLocale): Promise<ExperiencesHub | null> => {
		return getCachedExperiencesHub(locale);
	}
);
