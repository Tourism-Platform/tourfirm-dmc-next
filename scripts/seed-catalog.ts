import "./load-env.js";

import { withPayloadSession } from "./seed/lib/payload-session.js";
import { seedCatalogPage } from "./seed/seeders/catalog-page.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedCatalogPage(payload);
	});

	console.log("Catalog seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("Catalog seed failed:", error);
	process.exit(1);
});
