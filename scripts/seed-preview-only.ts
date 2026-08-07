import "./load-env.js";

import { ensureUiPreviewSchema } from "./ensure-ui-preview-schema.js";
import { withPayloadSession } from "./seed/lib/payload-session.js";
import { seedUiPreview } from "./seed/seeders/ui-preview.js";

async function main(): Promise<void> {
	await ensureUiPreviewSchema();

	await withPayloadSession(async (payload) => {
		await seedUiPreview(payload);
	});

	console.log("Preview UI content seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("Preview UI content seed failed:", error);
	process.exit(1);
});
