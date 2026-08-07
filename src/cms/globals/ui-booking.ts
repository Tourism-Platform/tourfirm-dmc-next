import type { GlobalConfig } from "payload";

import bookingPageTemplate from "../../../content/ui-texts/en/preview_booking_page.json";
import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { buildLocalizedFieldsFromJson } from "../fields/ui-content/build-localized-group";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

export const UiBooking: GlobalConfig = {
	slug: "ui-booking",
	label: "Booking",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiContentCache]
	},
	fields: buildLocalizedFieldsFromJson(
		bookingPageTemplate as Record<string, unknown>
	)
};
