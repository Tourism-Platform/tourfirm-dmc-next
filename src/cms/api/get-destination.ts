import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { DESTINATION_GLOBAL_CACHE_TAG } from "@/cms/cache/cache-tags";
import type { Destination } from "@/payload-types";

type TLocale = "en" | "ru" | "uz";

async function fetchDestination(locale: string): Promise<Destination | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "destination",
			locale: locale as TLocale,
			depth: 2,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedDestination = unstable_cache(
	fetchDestination,
	["destination-global"],
	{
		tags: [DESTINATION_GLOBAL_CACHE_TAG],
		revalidate: 60
	}
);

export const getDestination = cache(
	async (locale: string): Promise<Destination | null> => {
		return getCachedDestination(locale);
	}
);
