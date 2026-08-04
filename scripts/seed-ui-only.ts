import "./load-env.js";

import { getPayload } from "payload";

import { seedUiContent } from "./seed-ui-content.js";
import {
	attachSeedPoolErrorHandler,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "./seed-timing.js";

async function main(): Promise<void> {
	const uri = resolveSeedDatabaseUri();
	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = uri;

	await wakeDatabase(uri);
	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	await seedUiContent(payload);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("UI content seed complete");
}

main().catch((error) => {
	console.error("UI content seed failed:", error);
	process.exit(1);
});
