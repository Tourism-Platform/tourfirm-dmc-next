import { Card, CardContent } from "@/shared/ui";

type TServicesProcessCardProps = {
	step: string;
	title: string;
	description: string;
};

export function ServicesProcessCard({
	step,
	title,
	description
}: TServicesProcessCardProps) {
	return (
		<Card className="gap-0 py-0 shadow-none">
			<CardContent className="flex flex-col gap-1.5 p-4 sm:p-5">
				<p className="text-primary text-lg font-semibold tabular-nums">
					{step}
				</p>
				<h3 className="text-sm font-semibold sm:text-base">{title}</h3>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
