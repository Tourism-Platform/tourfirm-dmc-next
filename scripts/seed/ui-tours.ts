import "../load-env.js";

import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiTours } from "./seeders/ui-tours.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedUiTours(payload);
	});

	console.log("seed:ui-tours complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-tours failed:", error);
	process.exit(1);
});
