import type { GlobalConfig } from "payload";

import ordersPageTemplate from "../../../content/ui-texts/en/orders_page.json";
import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { buildLocalizedFieldsFromJson } from "../fields/ui-content/build-localized-group";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

export const UiOrders: GlobalConfig = {
	slug: "ui-orders",
	label: "Orders",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiContentCache]
	},
	fields: buildLocalizedFieldsFromJson(
		ordersPageTemplate as Record<string, unknown>
	)
};
