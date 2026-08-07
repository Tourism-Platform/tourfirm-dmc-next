import "../load-env.js";

import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiLogin } from "./seeders/ui-login.js";

async function main(): Promise<void> {
	await withPayloadSession(async (payload) => {
		await seedUiLogin(payload);
	});

	console.log("seed:ui-login complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-login failed:", error);
	process.exit(1);
});
