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
const UPDATE_SAMPLE = path.join(ROOT, "public/assets/images/hero-image.jpg");
const SOURCE_PATH = `__smoke__/r2-media-${Date.now()}.svg`;
const UPDATE_SOURCE_PATH = `__smoke__/r2-media-updated-${Date.now()}.jpg`;

function describeUrl(url: unknown) {
	if (typeof url !== "string" || url.length === 0) {
		return { raw: String(url ?? ""), hostname: "(empty)", protocol: "(empty)" };
	}

	if (url.startsWith("http://") || url.startsWith("https://")) {
		try {
			const parsed = new URL(url);
			return {
				raw: url,
				hostname: parsed.hostname,
				protocol: parsed.protocol.replace(":", "")
			};
		} catch {
			return { raw: url, hostname: "(invalid-url)", protocol: "(invalid-url)" };
		}
	}

	return { raw: url, hostname: "(relative)", protocol: "(relative)" };
}

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
	const createdUrl = describeUrl(created.url);
	console.log("   url:", createdUrl.raw);
	console.log("   hostname:", createdUrl.hostname);
	console.log("   protocol:", createdUrl.protocol);
	console.log("   filename:", created.filename);
	console.log("   sizes:", "sizes" in created ? created.sizes : null);

	const absolute = typeof created.url === "string" && created.url.startsWith("http");
	console.log("2) media.url absolute?", absolute);

	const updateFileBuffer = await fs.readFile(UPDATE_SAMPLE);
	console.log("3) update media with filePath-equivalent file payload…");
	const updated = await payload.update({
		collection: "media",
		id: created.id,
		data: {
			sourcePath: UPDATE_SOURCE_PATH,
			alt: "r2-smoke-updated"
		},
		file: {
			data: updateFileBuffer,
			mimetype: "image/jpeg",
			name: `r2-smoke-updated-${Date.now()}.jpg`,
			size: updateFileBuffer.length
		},
		overrideAccess: true
	});
	const updatedUrl = describeUrl(updated.url);
	console.log("   same id after update:", updated.id === created.id);
	console.log("   updated url:", updatedUrl.raw);
	console.log("   updated hostname:", updatedUrl.hostname);
	console.log("   updated protocol:", updatedUrl.protocol);
	console.log("   updated filename:", updated.filename);
	console.log("   updated mimeType:", updated.mimeType);

	console.log("4) delete media…");
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
