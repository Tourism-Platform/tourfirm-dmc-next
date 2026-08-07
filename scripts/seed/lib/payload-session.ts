import type { Payload } from "payload";
import { getPayload } from "payload";

import {
	attachSeedPoolErrorHandler,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "../../seed-timing.js";

export async function withPayloadSession<T>(
	handler: (payload: Payload) => Promise<T>
): Promise<T> {
	const uri = resolveSeedDatabaseUri();
	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = uri;

	await wakeDatabase(uri);

	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	try {
		return await handler(payload);
	} finally {
		if (typeof payload.db?.destroy === "function") {
			await payload.db.destroy();
		}
	}
}
