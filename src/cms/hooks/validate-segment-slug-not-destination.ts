import type { CollectionBeforeValidateHook } from "payload";
import { ValidationError } from "payload";

import { normalizeSlug } from "../lib/slug-utils";

import { validateSegmentSlug } from "./validate-segment-slug";

export const validateSegmentSlugNotDestination: CollectionBeforeValidateHook =
	async ({ data, req }) => {
		if (req.context?.isSeed) {
			return data;
		}

		if (!data?.slug) {
			return data;
		}

		const slug = normalizeSlug(data.slug);

		if (!slug) {
			return data;
		}

		const formatResult = validateSegmentSlug(slug);

		if (formatResult !== true) {
			throw new ValidationError({
				errors: [{ message: formatResult, path: "slug" }]
			});
		}

		const destination = await req.payload.findGlobal({
			slug: "destination",
			locale: req.locale,
			fallbackLocale: "en"
		});

		if (destination?.slug === slug) {
			throw new ValidationError({
				errors: [
					{
						message:
							"This slug is already used by the destinations page",
						path: "slug"
					}
				]
			});
		}

		return data;
	};
