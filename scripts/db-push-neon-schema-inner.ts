/**
 * Inner Payload getPayload() with PAYLOAD_DB_PUSH=true.
 * Auto-answers drizzle rename/create prompts by emitting Enter keypress.
 */
import readline from "node:readline";

import "./load-env.js";

import { getPayload } from "payload";

import { maskConnectionUri } from "./seed-timing.js";

async function main(): Promise<void> {
	const uri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	process.env.DATABASE_URI = uri;
	process.env.PAYLOAD_DB_PUSH = "true";
	process.env.PAYLOAD_SEED_MODE = "true";

	readline.emitKeypressEvents(process.stdin);

	const autoEnter = setInterval(() => {
		process.stdin.emit("keypress", "\r", {
			name: "return",
			ctrl: false,
			meta: false,
			shift: false,
			sequence: "\r"
		});
	}, 250);

	console.log(`Inner push → ${maskConnectionUri(uri)}`);

	try {
		const { default: config } = await import("@payload-config");
		const payload = await getPayload({ config });

		console.log("Neon schema push ok");

		if (typeof payload.db?.destroy === "function") {
			await payload.db.destroy();
		}
	} finally {
		clearInterval(autoEnter);
	}

	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
