import "../load-env.js";

import { ensureUiPreviewSchema } from "../ensure-ui-preview-schema.js";
import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiPreview } from "./seeders/ui-preview.js";

async function main(): Promise<void> {
	await ensureUiPreviewSchema();

	await withPayloadSession(async (payload) => {
		await seedUiPreview(payload);
	});

	console.log("seed:ui-preview complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-preview failed:", error);
	process.exit(1);
});
