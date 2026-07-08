import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	type TPageDomain,
	buildPageDomainWhere
} from "@/shared/config/cms/page-domains";

import { toGeoLocale } from "./geo-locale";
import type { Page } from "@/payload-types";

export const findPagesByDomain = cache(
	async (locale: string, domain: TPageDomain): Promise<Page[]> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "pages",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 100,
				sort: "title",
				where: {
					and: [
						buildPageDomainWhere(domain),
						{
							_status: {
								equals: "published"
							}
						}
					]
				}
			});

			return result.docs;
		} catch {
			return [];
		}
	}
);

export const findLegalPages = cache(
	async (locale: string): Promise<Page[]> =>
		findPagesByDomain(locale, "legal")
);

export const findTeamMembers = cache(
	async (locale: string): Promise<Page[]> => findPagesByDomain(locale, "team")
);
