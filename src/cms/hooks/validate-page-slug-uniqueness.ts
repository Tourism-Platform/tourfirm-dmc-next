import type { CollectionBeforeValidateHook, Where } from "payload";
import { ValidationError } from "payload";

import { getRelationId } from "../lib/slug-utils";

export const validatePageSlugUniqueness: CollectionBeforeValidateHook = async ({
	data,
	originalDoc,
	req
}) => {
	if (req.context?.isSeed) {
		return data;
	}

	if (!data?.slug) {
		return data;
	}

	const segmentId = getRelationId(
		data.segment as Parameters<typeof getRelationId>[0]
	);
	const pathGroup =
		typeof data.pathGroup === "string" && data.pathGroup.trim()
			? data.pathGroup.trim()
			: null;
	const currentId = originalDoc?.id;

	const and: Where[] = [
		{
			slug: {
				equals: data.slug
			}
		}
	];

	if (segmentId != null) {
		and.push({
			segment: {
				equals: segmentId
			}
		});

		if (pathGroup) {
			and.push({
				pathGroup: {
					equals: pathGroup
				}
			});
		} else {
			and.push({
				pathGroup: {
					exists: false
				}
			});
		}
	} else {
		and.push({
			segment: {
				exists: false
			}
		});
	}

	if (currentId != null) {
		and.push({
			id: {
				not_equals: currentId
			}
		});
	}

	const existing = await req.payload.find({
		collection: "pages",
		limit: 1,
		locale: req.locale,
		where: {
			and
		}
	});

	if (existing.docs.length > 0) {
		throw new ValidationError({
			errors: [
				{
					message: segmentId
						? "A page with this slug already exists in this segment"
						: "A page with this slug already exists without a segment",
					path: "slug"
				}
			]
		});
	}

	return data;
};
