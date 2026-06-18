import { cn } from "@/shared/lib";

import { BlockType, type TBlockRenderProps } from "../types/block-render.types";

import { BlockRender } from "./block-render";

type TBlocksLayoutProps = {
	sections: TBlockRenderProps[];
	contentClassName?: string;
};

export function BlocksLayout({
	sections,
	contentClassName = ""
}: TBlocksLayoutProps) {
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
			<div
				className={cn(
					"mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8",
					contentClassName
				)}
			>
				{otherSections.map((section, index) => (
					<BlockRender key={section.title ?? index} {...section} />
				))}
			</div>
		</div>
	);
}
