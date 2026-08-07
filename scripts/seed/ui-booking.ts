import "../load-env.js";

import { ensureUiBookingSchema } from "../ensure-ui-booking-schema.js";
import { withPayloadSession } from "./lib/payload-session.js";
import { seedUiBooking } from "./seeders/ui-booking.js";

async function main(): Promise<void> {
	await ensureUiBookingSchema();

	await withPayloadSession(async (payload) => {
		await seedUiBooking(payload);
	});

	console.log("seed:ui-booking complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-booking failed:", error);
	process.exit(1);
});
