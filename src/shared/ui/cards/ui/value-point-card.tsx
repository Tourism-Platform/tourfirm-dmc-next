import type { TValuePointCardProps } from "../types/value-point-card.types";

export function ValuePointCard({ data }: TValuePointCardProps) {
	const Icon = data.icon;

	return (
		<div className="border-border bg-card h-full rounded-[10px] border px-4 py-4 sm:px-[18px] sm:py-4">
			{Icon ? <Icon className="text-primary mb-3 size-5" /> : null}
			<h4 className="text-foreground font-serif text-lg leading-snug font-medium italic">
				{data.title}
			</h4>
			{data.description ? (
				<p className="text-muted-foreground mt-1 text-[12.5px] leading-snug">
					{data.description}
				</p>
			) : null}
		</div>
	);
}
