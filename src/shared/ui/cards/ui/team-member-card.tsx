import { Link } from "@/shared/i18n";

import { Card, CardContent } from "../../shadcn-ui/card";
import type { TTeamMemberCardProps } from "../types/team-member-card.types";

export function TeamMemberCard({ data }: TTeamMemberCardProps) {
	const Icon = data.icon;

	return (
		<Link href={data.href} className="group block h-full">
			<Card className="gap-0 py-0 shadow-none transition-shadow group-hover:shadow-md h-full">
				<CardContent className="flex flex-col gap-3 p-5 sm:p-6">
					<div className="flex items-center gap-2">
						<Icon className="text-primary size-5 shrink-0" />
						<h3 className="text-base font-semibold sm:text-lg">
							{data.title}
						</h3>
					</div>
					<p className="text-muted-foreground text-sm sm:text-base">
						{data.description}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
