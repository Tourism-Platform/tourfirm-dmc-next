import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { localizedText } from "../fields/ui-content/localized-text";

export const UiWidgets: GlobalConfig = {
	slug: "ui-widgets",
	label: "Widgets",
	access: {
		read: authenticatedOrPublished
	},
	fields: [
		{
			name: "routeTimeline",
			type: "group",
			fields: [localizedText("title"), localizedText("stopLabel")]
		}
	]
};
