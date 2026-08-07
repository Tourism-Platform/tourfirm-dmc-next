import "../load-env.js";

import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiCatalog } from "./seeders/ui-catalog.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedUiCatalog(payload);
	});

	console.log("seed:ui-catalog complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-catalog failed:", error);
	process.exit(1);
});
