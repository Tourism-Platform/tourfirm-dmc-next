import type { LucideIcon } from "lucide-react";

type TOverviewStatCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
};

export function OverviewStatCard({
	icon: Icon,
	value
}: TOverviewStatCardProps) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Icon className="text-primary size-4 shrink-0" />
			<p className="text-sm leading-snug">
				<span className="font-semibold">{value}</span>
			</p>
		</div>
	);
}
