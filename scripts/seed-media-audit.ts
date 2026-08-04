/**
 * Audit all Media records against S3/R2 storage.
 *
 * Usage:
 *   npm run seed:media-audit
 *   npm run seed:media-audit -- --check-only
 */
import "./load-env.js";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload, type Payload } from "payload";

import type { Media } from "@/payload-types";

import { isMediaBroken } from "./helpers/media-validator.js";
import {
	checkMediaObjectExistsInStorage,
	resolveMediaStorageKey
} from "./helpers/media-storage-check.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE_SIZE = 100;

type TMediaRow = {
	id: number | string;
	filename?: string | null;
	sourcePath?: string | null;
	key?: string;
};

type TAuditStats = {
	checked: number;
	valid: number;
	repaired: number;
	broken: number;
	repairFailedMissingSourceFile: number;
	skippedNoSourcePath: number;
	repairedFiles: TMediaRow[];
	brokenFiles: TMediaRow[];
	repairFailedFiles: TMediaRow[];
	missingSourcePath: TMediaRow[];
};

function isCheckOnlyMode(): boolean {
	return process.argv.includes("--check-only");
}

function formatRow(row: TMediaRow): string {
	const parts = [
		`id=${row.id}`,
		`filename=${row.filename ?? "(empty)"}`,
		`sourcePath=${row.sourcePath ?? "(none)"}`
	];

	if (row.key) {
		parts.push(`key=${row.key}`);
	}

	return parts.join(" ");
}

async function loadAllMedia(payload: Payload): Promise<Media[]> {
	const docs: Media[] = [];
	let page = 1;

	for (;;) {
		const result = await payload.find({
			collection: "media",
			limit: PAGE_SIZE,
			page,
			depth: 0,
			overrideAccess: true
		});

		docs.push(...(result.docs as Media[]));

		if (!result.hasNextPage) {
			break;
		}

		page += 1;
	}

	return docs;
}

async function localSourceExists(sourcePath: string): Promise<boolean> {
	const filePath = path.join(ROOT, "public", sourcePath);

	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function repairMedia(
	payload: Payload,
	media: Media,
	sourcePath: string
): Promise<Media> {
	const sourceFile = path.join(ROOT, "public", sourcePath);
	// Keep existing Media.filename as the upload basename so overwrite hits the
	// same storage key (avoids unique filename collisions like samarkand.jpg).
	const desiredName =
		typeof media.filename === "string" && media.filename.trim().length > 0
			? media.filename
			: path.basename(sourcePath);
	const tempDir = path.join(ROOT, "media", "uploads", "__audit_repair");
	await fs.mkdir(tempDir, { recursive: true });
	const tempPath = path.join(tempDir, desiredName);
	await fs.copyFile(sourceFile, tempPath);

	try {
		return (await payload.update({
			collection: "media",
			id: media.id,
			data: {
				sourcePath,
				alt:
					typeof media.alt === "string" && media.alt.length > 0
						? media.alt
						: path.basename(sourcePath, path.extname(sourcePath))
			},
			filePath: tempPath,
			overwriteExistingFiles: true,
			overrideAccess: true
		})) as Media;
	} finally {
		await fs.unlink(tempPath).catch(() => undefined);
	}
}

function toRow(media: Media, key?: string): TMediaRow {
	return {
		id: media.id,
		filename: media.filename,
		sourcePath: media.sourcePath,
		key
	};
}

async function auditMedia(
	payload: Payload,
	checkOnly: boolean
): Promise<TAuditStats> {
	const stats: TAuditStats = {
		checked: 0,
		valid: 0,
		repaired: 0,
		broken: 0,
		repairFailedMissingSourceFile: 0,
		skippedNoSourcePath: 0,
		repairedFiles: [],
		brokenFiles: [],
		repairFailedFiles: [],
		missingSourcePath: []
	};

	const docs = await loadAllMedia(payload);

	for (const media of docs) {
		const sourcePath =
			typeof media.sourcePath === "string" ? media.sourcePath.trim() : "";

		if (!sourcePath) {
			stats.skippedNoSourcePath += 1;
			stats.missingSourcePath.push({
				id: media.id,
				filename: media.filename,
				sourcePath: null
			});
			continue;
		}

		stats.checked += 1;

		const urlBroken = isMediaBroken(media).isBroken;
		const storage = urlBroken
			? {
					exists: false as const,
					key: resolveMediaStorageKey(media, sourcePath),
					reason: "not_found" as const
				}
			: await checkMediaObjectExistsInStorage(media, sourcePath);

		if (storage.exists) {
			stats.valid += 1;
			console.log(`✓ existing valid media: ${sourcePath}`);
			continue;
		}

		const row = toRow(media, storage.key);
		console.log("broken media", row);

		if (checkOnly) {
			stats.broken += 1;
			stats.brokenFiles.push(row);
			continue;
		}

		const hasLocal = await localSourceExists(sourcePath);

		if (!hasLocal) {
			stats.repairFailedMissingSourceFile += 1;
			stats.repairFailedFiles.push(row);
			console.log(
				`  ! repair skipped — missing local source file: public/${sourcePath}`
			);
			continue;
		}

		try {
			const repaired = await repairMedia(payload, media, sourcePath);
			const after = await checkMediaObjectExistsInStorage(
				repaired,
				sourcePath
			);

			if (!after.exists || isMediaBroken(repaired).isBroken) {
				stats.broken += 1;
				stats.brokenFiles.push(toRow(repaired, after.key));
				console.log("repair failed — object still missing", {
					id: repaired.id,
					filename: repaired.filename,
					sourcePath,
					key: after.key
				});
				continue;
			}

			stats.repaired += 1;
			stats.repairedFiles.push(toRow(repaired, after.key));
			console.log(`↻ repair broken media: ${sourcePath}`);
			console.log("repaired media", {
				id: repaired.id,
				filename: repaired.filename,
				sourcePath,
				key: after.key
			});
		} catch (error) {
			stats.broken += 1;
			stats.brokenFiles.push(row);
			console.log("repair failed — update error", {
				...row,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	return stats;
}

function printReport(stats: TAuditStats, checkOnly: boolean): void {
	console.log("\nMedia audit complete:");
	console.log(`  mode: ${checkOnly ? "check-only" : "repair"}`);
	console.log(`  checked: ${stats.checked}`);
	console.log(`  valid: ${stats.valid}`);
	console.log(`  repaired: ${stats.repaired}`);
	console.log(
		`  repairFailedMissingSourceFile: ${stats.repairFailedMissingSourceFile}`
	);
	console.log(`  skippedNoSourcePath: ${stats.skippedNoSourcePath}`);

	if (checkOnly) {
		console.log(`  broken: ${stats.broken}`);
	}

	if (stats.repairedFiles.length > 0) {
		console.log("  repaired files:");
		for (const row of stats.repairedFiles) {
			console.log(`    - ${formatRow(row)}`);
		}
	}

	if (stats.repairFailedFiles.length > 0) {
		console.log("  repairFailedMissingSourceFile:");
		for (const row of stats.repairFailedFiles) {
			console.log(`    - ${formatRow(row)}`);
		}
	}

	if (stats.brokenFiles.length > 0) {
		console.log("  broken files:");
		for (const row of stats.brokenFiles) {
			console.log(`    - ${formatRow(row)}`);
		}
	}

	if (stats.missingSourcePath.length > 0) {
		console.log("  missing sourcePath:");
		for (const row of stats.missingSourcePath) {
			console.log(
				`    - id: ${row.id} filename: ${row.filename ?? "(empty)"}`
			);
		}
	}
}

async function main(): Promise<void> {
	const { resolveSeedDatabaseUri } = await import("./seed-timing.js");
	process.env.DATABASE_URI = resolveSeedDatabaseUri();
	process.env.PAYLOAD_DB_PUSH = "false";

	const checkOnly = isCheckOnlyMode();
	console.log(
		`Media storage audit starting (${checkOnly ? "check-only" : "repair"})...`
	);
	console.log(`DB: ${process.env.DATABASE_URI.replace(/:[^:@/]+@/, ":***@")}`);

	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	const stats = await auditMedia(payload, checkOnly);

	printReport(stats, checkOnly);

	const failed =
		stats.broken > 0 ||
		stats.repairFailedMissingSourceFile > 0 ||
		(checkOnly && stats.valid !== stats.checked);

	process.exit(failed ? 1 : 0);
}

main().catch((error: unknown) => {
	console.error("Media audit failed:", error);
	process.exit(1);
});
