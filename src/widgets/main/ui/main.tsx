import { getTranslations } from "next-intl/server";

import type { TBlockRenderProps } from "@/shared/ui/blocks";
import { BlockRender, BlockType, mapBlockSection } from "@/shared/ui/blocks";

import { SearchToursBar } from "@/features/tours";

import { MAIN_PAGE_CONFIG } from "../model";
import type { TMainI18nKey } from "../model/types/common.types";
import type { TMainPageSectionConfig } from "../model/types/main-page.types";

export async function Main() {
	const t = await getTranslations("main_page");
	const translate = (key: string) => t(key as TMainI18nKey);

	const mapSection = (section: TMainPageSectionConfig): TBlockRenderProps => {
		const mapped = mapBlockSection(section, translate);

		if (section.blockType === BlockType.hero) {
			return {
				...mapped,
				children: <SearchToursBar className="shadow-lg" />
			};
		}

		return mapped;
	};

	const mainSections = MAIN_PAGE_CONFIG.sections.filter(
		(section) => section.blockType === BlockType.hero
	);
	const overviewStatsSections = MAIN_PAGE_CONFIG.sections.filter(
		(section) => section.blockType === BlockType.overviewStats
	);
	const otherSections = MAIN_PAGE_CONFIG.sections.filter(
		(section) =>
			section.blockType !== BlockType.hero &&
			section.blockType !== BlockType.overviewStats
	);

	return (
		<div className="flex flex-col">
			{mainSections.map((section, index) => (
				<BlockRender key={index} {...mapSection(section)} />
			))}
			{overviewStatsSections.map((section, index) => (
				<BlockRender key={index} {...mapSection(section)} />
			))}
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				{otherSections.map((section, index) => (
					<BlockRender key={index} {...mapSection(section)} />
				))}
			</div>
		</div>
	);
}
