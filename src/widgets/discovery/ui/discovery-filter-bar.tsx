import type { ComponentProps } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

type TFilterOption = {
	label: string;
	value: string;
	href: string;
	active?: boolean;
};

type TProps = {
	filters: TFilterOption[];
	className?: string;
};

type TLinkHref = ComponentProps<typeof Link>["href"];

export function DiscoveryFilterBar({ filters, className }: TProps) {
	if (!filters.length) {
		return null;
	}

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{filters.map((filter) => (
				<Link
					key={filter.value}
					href={filter.href as TLinkHref}
					className={cn(
						"rounded-full border px-4 py-2 text-sm transition-colors",
						filter.active
							? "bg-primary text-primary-foreground border-primary"
							: "bg-background text-foreground hover:bg-muted"
					)}
				>
					{filter.label}
				</Link>
			))}
		</div>
	);
}
