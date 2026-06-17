import { getTranslations } from "next-intl/server";

import { BlockRender, mapBlockSection } from "@/shared/ui/blocks";

import { ROUTE_MAP_SECTION_CONFIG } from "../model";
import type { TDestinationsI18nKey } from "../model/types/common.types";

export async function RouteMapSection() {
	const t = await getTranslations("destinations_page");
	const translate = (key: string) => t(key as TDestinationsI18nKey);

	return (
		<BlockRender
			{...mapBlockSection(ROUTE_MAP_SECTION_CONFIG, translate)}
		/>
	);
}
