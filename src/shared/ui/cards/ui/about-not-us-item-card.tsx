import type { TAboutNotUsItemCardProps } from "../types/about-not-us-item-card.types";

export function AboutNotUsItemCard({ not, because }: TAboutNotUsItemCardProps) {
	return (
		<li className="bg-card flex flex-col gap-2 rounded-xl border p-5 sm:p-6">
			<p className="text-sm font-semibold sm:text-base">{not}</p>
			<p className="text-muted-foreground text-sm sm:text-base">
				{because}
			</p>
		</li>
	);
}
