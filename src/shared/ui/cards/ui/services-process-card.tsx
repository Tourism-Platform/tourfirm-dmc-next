import { Badge } from "../../shadcn-ui/badge";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TServicesProcessCardProps } from "../types/services-process-card.types";

export function ServicesProcessCard({
	step,
	title,
	description
}: TServicesProcessCardProps) {
	return (
		<Card className="gap-0 py-0 shadow-none">
			<CardContent className="flex flex-col gap-1.5 p-4 sm:p-5">
				<div className="flex items-center gap-2">
					<Badge variant="secondary">{step}</Badge>
					<h3 className="text-sm font-semibold sm:text-base">
						{title}
					</h3>
				</div>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
