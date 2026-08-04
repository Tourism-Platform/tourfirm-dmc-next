import { Circle } from "lucide-react";

import type { TMiniTableCardProps } from "../types/mini-table-card.types";

export function MiniTableCard({ data }: TMiniTableCardProps) {
	const HeaderIcon = data.icon ?? Circle;

	return (
		<div className="bg-card overflow-hidden rounded-xl border shadow-sm">
			<div className="bg-primary text-primary-foreground flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5">
				<HeaderIcon className="size-4 shrink-0 opacity-90" />
				<h3 className="text-xs font-medium tracking-[0.14em] uppercase sm:text-sm">
					{data.title}
				</h3>
			</div>
			<ul className="divide-border divide-y">
				{data.rows.map((row, index) => {
					const RowIcon = row.icon;

					return (
						<li
							key={`${row.title}-${index}`}
							className="flex items-start gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
						>
							<span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10">
								<RowIcon className="size-4 sm:size-5" />
							</span>
							<div className="flex min-w-0 flex-col gap-0.5">
								<p className="text-foreground text-sm font-semibold sm:text-base">
									{row.title}
								</p>
								<p className="text-muted-foreground text-sm leading-snug">
									{row.description}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
