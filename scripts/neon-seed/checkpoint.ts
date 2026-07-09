import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { TNeonSeedStage } from "./loader.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CHECKPOINT_PATH = path.join(ROOT, ".dumps", "neon-seed-progress.json");

export type TNeonSeedCheckpoint = {
	version: 1;
	completedItems: number;
	lastCompleted: {
		stage: TNeonSeedStage;
		slug: string;
		itemIndex: number;
	};
	startedAt: string;
	updatedAt: string;
};

export function getCheckpointPath(): string {
	return CHECKPOINT_PATH;
}

export async function loadCheckpoint(): Promise<TNeonSeedCheckpoint | null> {
	try {
		const raw = await fs.readFile(CHECKPOINT_PATH, "utf8");
		const parsed = JSON.parse(raw) as TNeonSeedCheckpoint;

		if (parsed.version !== 1) {
			throw new Error(`Unsupported checkpoint version: ${String(parsed.version)}`);
		}

		return parsed;
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"code" in error &&
			(error as NodeJS.ErrnoException).code === "ENOENT"
		) {
			return null;
		}

		throw error;
	}
}

export async function saveCheckpoint(
	checkpoint: TNeonSeedCheckpoint
): Promise<void> {
	await fs.mkdir(path.dirname(CHECKPOINT_PATH), { recursive: true });
	await fs.writeFile(
		CHECKPOINT_PATH,
		`${JSON.stringify({ ...checkpoint, updatedAt: new Date().toISOString() }, null, 2)}\n`,
		"utf8"
	);
}

export function createFreshCheckpoint(): TNeonSeedCheckpoint {
	const now = new Date().toISOString();

	return {
		version: 1,
		completedItems: 0,
		lastCompleted: {
			stage: "badges",
			slug: "",
			itemIndex: 0
		},
		startedAt: now,
		updatedAt: now
	};
}
