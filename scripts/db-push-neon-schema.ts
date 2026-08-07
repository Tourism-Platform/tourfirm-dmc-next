/**
 * Push Payload schema to Neon (DATABASE_URI_DIRECT), non-interactive.
 * Usage: npm run db:push-neon-schema
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./load-env.js";

import { maskConnectionUri } from "./seed-timing.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main(): Promise<void> {
	const uri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	process.env.DATABASE_URI = uri;
	process.env.PAYLOAD_DB_PUSH = "true";
	process.env.PAYLOAD_SEED_MODE = "true";

	console.log(`Pushing Payload schema → Neon ${maskConnectionUri(uri)}`);

	const child = spawn(
		"npx",
		["tsx", path.join(ROOT, "scripts/db-push-neon-schema-inner.ts")],
		{
			cwd: ROOT,
			env: process.env,
			stdio: "inherit",
			shell: true
		}
	);

	const exitCode: number = await new Promise((resolve) => {
		child.on("exit", (code) => resolve(code ?? 1));
	});

	process.exit(exitCode);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
