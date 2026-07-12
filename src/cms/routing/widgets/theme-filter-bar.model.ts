import { ENUM_PATH } from "@/shared/config";

import type { TWidgetModelBuilder } from "./widget-model.types";
import type { Theme } from "@/payload-types";

export const buildThemeFilterBarModel: TWidgetModelBuilder = ({
	entityResult
}) => {
	const theme = entityResult.rawDocument as Theme | null;

	if (!theme?.slug) {
		return null;
	}

	return {
		key: "discoveryFilterBar",
		props: {
			filters: [
				{
					label: "All routes",
					value: "routes",
					href: `${ENUM_PATH.DISCOVERY.ROUTES}?theme=${theme.slug}`,
					active: false
				},
				{
					label: "All experiences",
					value: "experiences",
					href: `${ENUM_PATH.DISCOVERY.EXPERIENCES}?theme=${theme.slug}`,
					active: false
				}
			]
		}
	};
};
