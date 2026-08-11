import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { RoutesHub } from "@/payload-types";

async function fetchRoutesHub(locale: TypedLocale): Promise<RoutesHub | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "routes-hub",
			locale,
			depth: 2,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedRoutesHub = unstable_cache(fetchRoutesHub, ["routes-hub"], {
	revalidate: 60
});

export const getRoutesHub = cache(
	async (locale: TypedLocale): Promise<RoutesHub | null> => {
		return getCachedRoutesHub(locale);
	}
);
