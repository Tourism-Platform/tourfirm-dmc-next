import type { TBlockRenderProps } from "@/shared/ui/blocks";
import { BlockRender, BlockType } from "@/shared/ui/blocks";

import { SearchToursBar } from "@/features/tours";

type TProps = {
	sections: TBlockRenderProps[];
};

function MainBlocks({ sections }: TProps) {
	const heroSections = sections.filter(
		(section) => section.blockType === BlockType.hero
	);
	const overviewStatsSections = sections.filter(
		(section) => section.blockType === BlockType.overviewStats
	);
	const otherSections = sections.filter(
		(section) =>
			section.blockType !== BlockType.hero &&
			section.blockType !== BlockType.overviewStats
	);

	return (
		<div className="flex flex-col">
			{heroSections.map((section, index) => (
				<BlockRender key={section.title ?? index} {...section} />
			))}
			{overviewStatsSections.map((section, index) => (
				<BlockRender key={index} {...section} />
			))}
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				{otherSections.map((section, index) => (
					<BlockRender key={section.title ?? index} {...section} />
				))}
			</div>
		</div>
	);
}

function withHeroSearchBar(section: TBlockRenderProps): TBlockRenderProps {
	if (section.blockType !== BlockType.hero) {
		return section;
	}

	return {
		...section,
		children: <SearchToursBar className="shadow-lg" />
	};
}

export function Main({ sections }: TProps) {
	return <MainBlocks sections={sections.map(withHeroSearchBar)} />;
}
