process.env.PAYLOAD_DB_PUSH = "false";

import path from "node:path";
import { getPayload } from "payload";
import config from "@payload-config";
import {
	CONTENT_DIR,
	findSeedDocBySlug,
	pickLocale,
	readYamlFile
} from "./seed.js";
import { toDefaultRichText } from "./to-default-rich-text.js";

const LOCALES = ["en", "ru", "uz"] as const;

async function mediaIdBySource(
	payload: Awaited<ReturnType<typeof getPayload>>,
	sourcePath: string
): Promise<number> {
	const found = await payload.find({
		collection: "media",
		where: { sourcePath: { equals: sourcePath } },
		limit: 1,
		depth: 0,
		overrideAccess: true
	});
	const id = found.docs[0]?.id;
	if (typeof id !== "number") {
		throw new Error(`media not found: ${sourcePath}`);
	}
	return id;
}

function asRichText(value: unknown) {
	if (typeof value === "string") return toDefaultRichText(value);
	return value ?? undefined;
}

async function main() {
	const payload = await getPayload({ config });
	const raw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "routes", "silk-road-classics.yml")
	);
	const itineraryRaw = (raw.blocks as Record<string, unknown>[]).find(
		(b) => b.blockType === "itinerary"
	);
	if (!itineraryRaw) throw new Error("itinerary missing in yaml");

	const doc = await findSeedDocBySlug(payload, "routes", "silk-road-classics");
	if (!doc) throw new Error("route silk-road-classics not found");

	for (const locale of LOCALES) {
		const block = pickLocale(itineraryRaw, locale) as Record<string, unknown>;
		const items = await Promise.all(
			((block.items as Record<string, unknown>[]) ?? []).map(async (item) => {
				const image =
					typeof item.image === "string"
						? await mediaIdBySource(payload, item.image)
						: item.image;
				return {
					title: item.title,
					description: asRichText(item.description),
					image,
					meta: asRichText(item.meta)
				};
			})
		);

		const itinerary = {
			blockType: "itinerary",
			eyebrow: block.eyebrow,
			title: block.title,
			description: asRichText(block.description),
			note: block.note,
			items
		};

		const current = await payload.findByID({
			collection: "routes",
			id: doc.id,
			locale,
			depth: 0,
			overrideAccess: true
		});
		const blocks = [...((current.blocks as Record<string, unknown>[]) ?? [])];
		const existingIdx = blocks.findIndex((b) => b.blockType === "itinerary");
		const insertAfter = blocks.findIndex(
			(b) =>
				b.blockType === "regular" &&
				Array.isArray(b.cards) &&
				(b.cards as { type?: string }[]).some((c) => c.type === "destinationInsight")
		);
		if (existingIdx >= 0) {
			blocks[existingIdx] = itinerary;
		} else if (insertAfter >= 0) {
			blocks.splice(insertAfter + 1, 0, itinerary);
		} else {
			blocks.splice(1, 0, itinerary);
		}

		const updated = await payload.update({
			collection: "routes",
			id: doc.id,
			data: { blocks },
			locale,
			overrideAccess: true,
			context: { isSeed: true }
		});
		const types = ((updated.blocks as { blockType?: string }[]) ?? []).map(
			(b) => b.blockType
		);
		const saved = ((updated.blocks as Record<string, unknown>[]) ?? []).find(
			(b) => b.blockType === "itinerary"
		) as { items?: unknown[]; title?: string } | undefined;
		console.log(
			locale,
			"idx",
			types.indexOf("itinerary"),
			"blocks",
			types.join(","),
			"items",
			saved?.items?.length ?? 0,
			"title",
			saved?.title
		);
	}

	if (typeof payload.db?.destroy === "function") await payload.db.destroy();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
