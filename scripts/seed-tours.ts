import "./load-env.js";

import { withPayloadSession } from "./seed/lib/payload-session.js";
import { seedToursPage } from "./seed/seeders/tours-page.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedToursPage(payload);
	});

	console.log("Tours seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("Tours seed failed:", error);
	process.exit(1);
});
