import type { CollectionBeforeDeleteHook } from "payload";
import { APIError } from "payload";

import { getRelationId } from "../lib/slug-utils";

export const preventDeleteSegmentWithPages: CollectionBeforeDeleteHook =
	async ({ id, req }) => {
		const segmentId = getRelationId(id);

		if (segmentId == null) {
			return;
		}

		const pages = await req.payload.count({
			collection: "pages",
			where: {
				segment: {
					equals: segmentId
				}
			}
		});

		if (pages.totalDocs > 0) {
			throw new APIError(
				"Невозможно удалить сегмент, пока в нём есть страницы.",
				400
			);
		}
	};
