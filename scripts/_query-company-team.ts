import "./load-env.js";

import { getPayload } from "payload";

import {
	attachSeedPoolErrorHandler,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "./seed-timing.js";

const EXPECTED = [
	"komila-kholmatova",
	"alina-bikbulatova",
	"yulduz-safarova",
	"soyibjon-isamatov",
	"subin-kang",
	"odina-karahodzhayeva",
	"alizhon-mamatkulov"
] as const;

async function main(): Promise<void> {
	const uri = resolveSeedDatabaseUri();
	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = uri;

	await wakeDatabase(uri);
	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const team = await payload.find({
		collection: "pages",
		locale: "ru",
		limit: 50,
		depth: 0,
		overrideAccess: true,
		where: { pathGroup: { equals: "team" } }
	});

	const rows = team.docs.map((doc) => ({
		id: doc.id,
		slug: doc.slug,
		title: doc.title,
		blocks: Array.isArray(doc.blocks) ? doc.blocks.length : 0
	}));

	console.log(`team pages: ${team.totalDocs}`);
	console.log(JSON.stringify(rows, null, 2));

	const slugs = new Set(rows.map((row) => row.slug));
	const missing = EXPECTED.filter((slug) => !slugs.has(slug));
	console.log(
		missing.length === 0
			? "expected slugs: all present"
			: `missing: ${missing.join(", ")}`
	);

	const komila = team.docs.find((doc) => doc.slug === "komila-kholmatova");
	const komilaBlocks = Array.isArray(komila?.blocks) ? komila.blocks : [];
	console.log(
		"komila blocks:",
		komilaBlocks.map((block) => {
			const item = block as { blockType?: string; title?: string };
			return `${item.blockType}:${item.title ?? ""}`;
		})
	);

	const about = await payload.find({
		collection: "pages",
		locale: "ru",
		limit: 1,
		depth: 2,
		overrideAccess: true,
		where: { slug: { equals: "about" } }
	});
	const aboutDoc = about.docs[0];
	const aboutBlocks = Array.isArray(aboutDoc?.blocks) ? aboutDoc.blocks : [];
	const teamCards = aboutBlocks.flatMap((block) => {
		const cards = (block as { cards?: Array<{ href?: string; title?: string; description?: string }> }).cards;
		return cards ?? [];
	});
	const komilaCard = teamCards.find((card) =>
		String(card.href ?? "").includes("komila-kholmatova")
	);
	console.log("about komila card:", komilaCard?.title, komilaCard?.description);

	process.exit(komilaBlocks.length >= 9 && missing.length === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
