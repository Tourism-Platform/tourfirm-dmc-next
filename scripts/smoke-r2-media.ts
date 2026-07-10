/**
 * One-off smoke: upload → read url → delete against R2 via Payload.
 * Run: npx tsx scripts/smoke-r2-media.ts
 */
import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload } from "payload";

import config from "../payload.config";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLE = path.join(ROOT, "public/assets/images/logo.svg");
const SOURCE_PATH = `__smoke__/r2-media-${Date.now()}.svg`;

async function main() {
	if (!process.env.S3_BUCKET) {
		console.error("S3_BUCKET is not set — skip R2 smoke");
		process.exit(1);
	}

	const payload = await getPayload({ config });
	const fileBuffer = await fs.readFile(SAMPLE);

	console.log("1) create media…");
	const created = await payload.create({
		collection: "media",
		data: {
			sourcePath: SOURCE_PATH,
			alt: "r2-smoke"
		},
		file: {
			data: fileBuffer,
			mimetype: "image/svg+xml",
			name: `r2-smoke-${Date.now()}.svg`,
			size: fileBuffer.length
		},
		overrideAccess: true
	});

	console.log("   id:", created.id);
	console.log("   url:", created.url);
	console.log("   filename:", created.filename);
	console.log("   sizes:", "sizes" in created ? created.sizes : null);

	const absolute = typeof created.url === "string" && created.url.startsWith("http");
	console.log("2) media.url absolute?", absolute);

	console.log("3) delete media…");
	await payload.delete({
		collection: "media",
		id: created.id,
		overrideAccess: true
	});
	console.log("   deleted");

	console.log("Smoke OK");
	process.exit(0);
}

main().catch((error) => {
	console.error("Smoke FAILED:", error);
	process.exit(1);
});
