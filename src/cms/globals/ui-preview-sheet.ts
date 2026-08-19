import type { GlobalConfig } from "payload";

import optionSheetTemplate from "../../../content/ui-texts/en/preview_option_sheet.json";
import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { buildLocalizedFieldsFromJson } from "../fields/ui-content/build-localized-group";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

export const UiPreviewSheet: GlobalConfig = {
	slug: "ui-preview-sheet",
	label: "Preview sheet",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiContentCache]
	},
	fields: buildLocalizedFieldsFromJson(
		optionSheetTemplate as Record<string, unknown>
	)
};
