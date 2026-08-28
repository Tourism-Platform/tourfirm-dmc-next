import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { cn } from "@/shared/lib/utils";
import { PageBreadcrumbs } from "@/shared/ui/breadcrumbs";

import { BlockType, type TBlockRenderProps } from "../types/block-render.types";

import { BlockRender } from "./block-render";

type TBlocksLayoutProps = {
	sections: TBlockRenderProps[];
	contentClassName?: string;
	breadcrumbItems?: TBreadcrumbItem[];
};

export function BlocksLayout({
	sections,
	contentClassName = "",
	breadcrumbItems
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
				<BlockRender
					key={section.title ?? index}
					{...section}
					topContent={
						index === 0 && breadcrumbItems?.length ? (
							<PageBreadcrumbs
								items={breadcrumbItems}
								className="mb-6 text-white/80"
							/>
						) : undefined
					}
				/>
			))}
			{overviewStatsSections.map((section, index) => (
				<div key={index} className="pt-28 md:pt-20">
					<BlockRender {...section} />
				</div>
			))}
			<div
				className={cn(
					"flex w-full flex-col gap-12 pt-12 sm:gap-14 sm:pt-14 lg:gap-16",
					!overviewStatsSections.length && "pt-10",
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
