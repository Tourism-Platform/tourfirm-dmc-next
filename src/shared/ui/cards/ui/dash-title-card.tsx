import type { TDashTitleCardProps } from "../types/dash-title-card.types";

export function DashTitleCard({ data }: TDashTitleCardProps) {
	return (
		<div className="flex flex-col gap-3">
			{data.title ? (
				<div className="flex items-center gap-2">
					<span
						aria-hidden
						className="bg-muted-foreground/60 h-px w-4 shrink-0"
					/>
					<h3 className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase sm:text-sm">
						{data.title}
					</h3>
				</div>
			) : null}
			<p className="font-serif text-foreground text-base leading-relaxed sm:text-lg">
				{data.description}
			</p>
		</div>
	);
}
