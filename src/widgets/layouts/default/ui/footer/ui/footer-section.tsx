"use client";

import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import type { IFooterLink } from "../model";

interface IFooterSectionProps {
	title: string;
	links: IFooterLink[];
	comingSoonLabel: string;
}

export const FooterSection = ({
	title,
	links,
	comingSoonLabel
}: IFooterSectionProps) => (
	<div className="flex flex-col gap-4">
		<p className="text-base font-medium text-foreground">{title}</p>
		<ul className="flex flex-col gap-3">
			{links.map((link) => (
				<li key={link.label}>
					{link.isSoon ? (
						<span
							className={cn(
								"flex items-center gap-2 text-sm font-normal text-muted-foreground"
							)}
						>
							{link.label}
							<Badge
								variant="secondary"
								className="h-5 border-none px-1.5 py-0 text-[10px] font-medium"
							>
								{comingSoonLabel}
							</Badge>
						</span>
					) : (
						<a
							href={link.path}
							className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					)}
				</li>
			))}
		</ul>
	</div>
);
