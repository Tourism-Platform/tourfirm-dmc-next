import "../load-env.js";

import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiOrders } from "./seeders/ui-orders.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedUiOrders(payload);
	});

	console.log("seed:ui-orders complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-orders failed:", error);
	process.exit(1);
});
