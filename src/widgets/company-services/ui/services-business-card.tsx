import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

type TServicesBusinessCardProps = {
	badge: string;
	title: string;
	description: string;
	icon: LucideIcon;
	className?: string;
};

export function ServicesBusinessCard({
	badge,
	title,
	description,
	icon: Icon,
	className
}: TServicesBusinessCardProps) {
	return (
		<Card className={cn("h-full gap-0 py-0 shadow-none", className)}>
			<CardHeader className="block space-y-3 px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
				<div className="flex items-start gap-2.5">
					<div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
						<Icon className="text-primary size-4" />
					</div>
					<div className="flex min-w-0 flex-col gap-0.5">
						<p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest">
							{badge}
						</p>
						<CardTitle className="text-sm leading-snug sm:text-base">
							{title}
						</CardTitle>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
