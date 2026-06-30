"use client";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import type { TResolvedFooterLink } from "@/shared/types/navigation.types";
import { Badge } from "@/shared/ui";

interface IFooterSectionProps {
	title: string;
	links: TResolvedFooterLink[];
	comingSoonLabel: string;
}

function isExternalHref(href: string): boolean {
	return href.startsWith("http://") || href.startsWith("https://");
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
				<li key={link.key}>
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
					) : isExternalHref(link.href) ? (
						<a
							href={link.href}
							target={link.target ?? "_blank"}
							rel="noopener noreferrer"
							className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					) : (
						<Link
							href={link.href}
							className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</Link>
					)}
				</li>
			))}
		</ul>
	</div>
);
