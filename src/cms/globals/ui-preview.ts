import type { GlobalConfig } from "payload";

import optionsTemplate from "../../../content/ui-texts/en/options.json";
import optionPageTemplate from "../../../content/ui-texts/en/preview_option_page.json";
import tourPageTemplate from "../../../content/ui-texts/en/preview_tour_page.json";
import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { buildLocalizedFieldsFromJson } from "../fields/ui-content/build-localized-group";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

const labelsTemplate = {
	languages: optionsTemplate.tour.languages,
	pickup: optionsTemplate.tour.pickup
};

export const UiPreview: GlobalConfig = {
	slug: "ui-preview",
	label: "Preview",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiContentCache]
	},
	fields: [
		{
			name: "tour",
			type: "group",
			label: "Tour preview",
			fields: buildLocalizedFieldsFromJson(
				tourPageTemplate as Record<string, unknown>
			)
		},
		{
			name: "option",
			type: "group",
			label: "Option preview",
			fields: buildLocalizedFieldsFromJson(
				optionPageTemplate as Record<string, unknown>
			)
		},
		{
			name: "labels",
			type: "group",
			label: "Option labels",
			fields: buildLocalizedFieldsFromJson(
				labelsTemplate as Record<string, unknown>
			)
		}
	]
};
