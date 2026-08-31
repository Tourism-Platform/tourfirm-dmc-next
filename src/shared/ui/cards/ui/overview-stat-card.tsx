import { cn } from "@/shared/lib/utils";

import type { TOverviewStatCardProps } from "../types/overview-stat-card.types";

export function OverviewStatCard({
	icon: Icon,
	value,
	label,
	hint,
	langs
}: TOverviewStatCardProps) {
	const isDetailed = Boolean(label || hint || langs?.length);

	if (!isDetailed) {
		return (
			<div className="bg-card flex h-full items-center gap-3 rounded-xl border px-4 py-3 shadow-xs">
				<span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
					<Icon className="size-4" />
				</span>
				<p className="text-sm leading-snug">
					<span className="font-semibold">{value}</span>
				</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-3 px-5 py-5 sm:px-6">
			<div className="flex items-center gap-2.5">
				<span className="bg-accent text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
					<Icon className="size-3.5" />
				</span>
				{label ? (
					<span className="text-muted-foreground text-[10px] font-semibold tracking-[0.16em] uppercase">
						{label}
					</span>
				) : null}
			</div>
			{langs?.length ? (
				<div className="flex flex-wrap gap-1.5">
					{langs.map((lang) => (
						<span
							key={lang}
							className="bg-accent text-primary rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide"
						>
							{lang}
						</span>
					))}
				</div>
			) : (
				<p
					className={cn(
						"text-foreground text-[17px] leading-snug font-semibold tracking-tight"
					)}
				>
					{value}
				</p>
			)}
			{hint ? (
				<p className="text-muted-foreground text-[12.5px] leading-snug">
					{hint}
				</p>
			) : null}
		</div>
	);
}
