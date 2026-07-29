import "./load-env.js";

import { getPayload } from "payload";

import config from "@payload-config";

import { maskConnectionUri } from "./seed-timing.js";

/**
 * Sync Payload/Drizzle schema to the local DATABASE_URI.
 * Uses the same adapter `push` flag as payload.config.ts.
 */
async function main() {
	process.env.PAYLOAD_DB_PUSH = "true";
	process.env.PAYLOAD_SEED_MODE = "true";

	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	console.log(`Pushing schema → ${maskConnectionUri(uri)}`);

	const payload = await getPayload({ config });

	console.log("Schema push ok");

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
