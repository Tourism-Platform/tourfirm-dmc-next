import { Badge } from "../../shadcn-ui/badge";
import type { TAboutDevelopmentPhaseCardProps } from "../types/about-development-phase-card.types";

export function AboutDevelopmentPhaseCard({
	label,
	icon: Icon,
	description
}: TAboutDevelopmentPhaseCardProps) {
	return (
		<article className="bg-card flex flex-col gap-3 rounded-xl border p-5 sm:p-6">
			<Badge
				variant="secondary"
				className="bg-primary/10 text-primary w-fit rounded-full border-transparent"
			>
				{label}
			</Badge>
			<Icon className="text-primary size-5 shrink-0" aria-hidden />
			<p className="text-muted-foreground text-sm sm:text-base">
				{description}
			</p>
		</article>
	);
}
