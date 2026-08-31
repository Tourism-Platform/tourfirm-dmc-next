import { cn } from "@/shared/lib/utils";
import type { TContentRow } from "@/shared/ui/blocks/types/block-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";
import { CardRender } from "@/shared/ui/cards/ui/card-render";

import { COLUMN_RATIO_CLASS, DEFAULT_COLUMN_RATIO } from "../lib/column-ratio";

type TContentRowsProps = {
	rows: TContentRow[];
};

function renderStack(cards: TCardRenderProps[]) {
	return (
		<div className="flex min-w-0 flex-col gap-6 sm:gap-8">
			{cards.map((card, index) => (
				<CardRender
					key={card.key ?? String(index)}
					type={card.type}
					item={card.item}
				/>
			))}
		</div>
	);
}

export function ContentRows({ rows }: TContentRowsProps) {
	return (
		<div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
			{rows.map((row, index) => {
				const left = row.left ?? [];
				const right = row.right ?? [];
				const hasLeft = left.length > 0;
				const hasRight = right.length > 0;

				if (!hasLeft && !hasRight) {
					return null;
				}

				if (!hasLeft) {
					return (
						<div key={row.key ?? String(index)}>
							{renderStack(right)}
						</div>
					);
				}

				if (!hasRight) {
					return (
						<div key={row.key ?? String(index)}>
							{renderStack(left)}
						</div>
					);
				}

				const ratio = row.ratio ?? DEFAULT_COLUMN_RATIO;
				const stickyLeft = ratio.startsWith("1:");

				return (
					<div
						key={row.key ?? String(index)}
						className={cn(
							"grid grid-cols-1 items-start gap-6 sm:gap-8",
							COLUMN_RATIO_CLASS[ratio]
						)}
					>
						<div
							className={
								stickyLeft
									? "md:sticky md:top-24 md:self-start"
									: undefined
							}
						>
							{renderStack(left)}
						</div>
						<div
							className={
								stickyLeft
									? undefined
									: "md:sticky md:top-24 md:self-start"
							}
						>
							{renderStack(right)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
