import type { getPayload } from "payload";
import "server-only";

import { auditSpan } from "@/cms/perf/audit-span";

type TPayload = Awaited<ReturnType<typeof getPayload>>;

type TLeanMedia = {
	id: number;
	url?: string | null;
	alt?: string | null;
	width?: number | null;
	height?: number | null;
	filename?: string | null;
};

type TLeanStopEntity = {
	id: number;
	title?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	mapCenter?: {
		latitude?: number | null;
		longitude?: number | null;
	} | null;
};

type TPolyRelation = {
	relationTo?: string;
	value?: number | TLeanStopEntity | null;
};

const MEDIA_KEYS = new Set(["image", "ogImage", "heroImage"]);

const GEO_COLLECTIONS = new Set([
	"countries",
	"regions",
	"cities",
	"attractions"
]);

function collectMediaIds(
	value: unknown,
	parentKey: string | undefined,
	out: Set<number>
): void {
	if (value == null) {
		return;
	}

	if (typeof value === "number") {
		if (parentKey && MEDIA_KEYS.has(parentKey)) {
			out.add(value);
		}
		return;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			collectMediaIds(item, parentKey, out);
		}
		return;
	}

	if (typeof value === "object") {
		for (const [key, child] of Object.entries(
			value as Record<string, unknown>
		)) {
			if (key === "relation") {
				continue;
			}
			collectMediaIds(child, key, out);
		}
	}
}

function collectStopRefs(blocks: unknown, out: Map<string, Set<number>>): void {
	if (!Array.isArray(blocks)) {
		return;
	}

	for (const block of blocks) {
		if (
			!block ||
			typeof block !== "object" ||
			(block as { blockType?: string }).blockType !== "routeMap"
		) {
			continue;
		}

		const stops = (block as { stops?: unknown[] }).stops;
		if (!Array.isArray(stops)) {
			continue;
		}

		for (const stop of stops) {
			const relation = (stop as { relation?: TPolyRelation }).relation;
			if (
				!relation?.relationTo ||
				!GEO_COLLECTIONS.has(relation.relationTo)
			) {
				continue;
			}

			const raw = relation.value;
			const id =
				typeof raw === "number"
					? raw
					: raw &&
						  typeof raw === "object" &&
						  typeof raw.id === "number"
						? raw.id
						: null;

			if (id == null) {
				continue;
			}

			const set = out.get(relation.relationTo) ?? new Set<number>();
			set.add(id);
			out.set(relation.relationTo, set);
		}
	}
}

function patchMedia(
	value: unknown,
	parentKey: string | undefined,
	mediaById: Map<number, TLeanMedia>
): unknown {
	if (value == null) {
		return value;
	}

	if (typeof value === "number") {
		if (parentKey && MEDIA_KEYS.has(parentKey)) {
			return mediaById.get(value) ?? value;
		}
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => patchMedia(item, parentKey, mediaById));
	}

	if (typeof value === "object") {
		const next: Record<string, unknown> = {};
		for (const [key, child] of Object.entries(
			value as Record<string, unknown>
		)) {
			if (key === "relation") {
				next[key] = child;
				continue;
			}
			next[key] = patchMedia(child, key, mediaById);
		}
		return next;
	}

	return value;
}

function patchStops(
	blocks: unknown,
	entities: Map<string, Map<number, TLeanStopEntity>>
): unknown {
	if (!Array.isArray(blocks)) {
		return blocks;
	}

	return blocks.map((block) => {
		if (
			!block ||
			typeof block !== "object" ||
			(block as { blockType?: string }).blockType !== "routeMap"
		) {
			return block;
		}

		const row = { ...(block as Record<string, unknown>) };
		const stops = Array.isArray(row.stops) ? row.stops : [];

		row.stops = stops.map((stop) => {
			if (!stop || typeof stop !== "object") {
				return stop;
			}

			const stopRow = { ...(stop as Record<string, unknown>) };
			const relation = stopRow.relation as TPolyRelation | undefined;
			if (!relation?.relationTo) {
				return stopRow;
			}

			const byId = entities.get(relation.relationTo);
			const raw = relation.value;
			const id =
				typeof raw === "number"
					? raw
					: raw &&
						  typeof raw === "object" &&
						  typeof raw.id === "number"
						? raw.id
						: null;

			if (id == null || !byId?.has(id)) {
				return stopRow;
			}

			stopRow.relation = {
				...relation,
				value: byId.get(id)!
			};
			return stopRow;
		});

		return row;
	});
}

/**
 * Depth 0 leaf docs keep media/stop relations as IDs.
 * Hydrate only SSR-required fields (media url/alt; stop title+coords).
 * Avoids Payload depth:1 loading full related geo docs including their blocks.
 */
export async function hydrateGeoPageDoc<T extends Record<string, unknown>>(
	payload: TPayload,
	locale: string,
	doc: T
): Promise<T> {
	const mediaIds = new Set<number>();
	collectMediaIds(doc.blocks, undefined, mediaIds);
	collectMediaIds(doc.seo, undefined, mediaIds);

	const stopRefs = new Map<string, Set<number>>();
	collectStopRefs(doc.blocks, stopRefs);

	const [mediaDocs, ...stopResults] = await auditSpan(
		"hydrateGeoPageDoc:payloadFinds",
		{
			locale,
			mediaCount: mediaIds.size,
			stopCollections: stopRefs.size
		},
		() =>
			Promise.all([
				mediaIds.size === 0
					? Promise.resolve({ docs: [] as TLeanMedia[] })
					: payload.find({
							collection: "media",
							depth: 0,
							limit: mediaIds.size,
							pagination: false,
							select: {
								id: true,
								url: true,
								alt: true,
								width: true,
								height: true,
								filename: true
							},
							where: { id: { in: [...mediaIds] } }
						}),
				...[...stopRefs.entries()].map(([collection, ids]) =>
					payload.find({
						collection: collection as
							| "countries"
							| "regions"
							| "cities"
							| "attractions",
						locale: locale as "en" | "ru" | "uz",
						fallbackLocale: "en",
						depth: 0,
						limit: ids.size,
						pagination: false,
						select: {
							id: true,
							title: true,
							latitude: true,
							longitude: true,
							mapCenter: true
						},
						where: { id: { in: [...ids] } }
					})
				)
			])
	);

	const mediaById = new Map<number, TLeanMedia>();
	for (const media of mediaDocs.docs as TLeanMedia[]) {
		mediaById.set(media.id, media);
	}

	const entities = new Map<string, Map<number, TLeanStopEntity>>();
	const collections = [...stopRefs.keys()];
	stopResults.forEach((result, index) => {
		const collection = collections[index]!;
		const byId = new Map<number, TLeanStopEntity>();
		for (const entity of result.docs as TLeanStopEntity[]) {
			byId.set(entity.id, entity);
		}
		entities.set(collection, byId);
	});

	const next = {
		...doc,
		blocks: patchStops(
			patchMedia(doc.blocks, undefined, mediaById),
			entities
		),
		seo: patchMedia(doc.seo, undefined, mediaById)
	};

	return next as T;
}
