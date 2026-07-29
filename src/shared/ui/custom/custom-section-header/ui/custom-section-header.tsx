import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type TCustomSectionHeaderProps = {
	eyebrow?: string;
	title: ReactNode;
	description?: string;
	actions?: ReactNode;
	className?: string;
};

export function CustomSectionHeader({
	eyebrow,
	title,
	description,
	actions,
	className
}: TCustomSectionHeaderProps) {
	const content = (
		<div className={cn("flex max-w-3xl flex-col gap-3", className)}>
			{eyebrow ? (
				<p className="font-mono text-primary text-xs font-medium uppercase tracking-[0.16em] sm:text-sm">
					{eyebrow}
				</p>
			) : null}
			<h2 className="font-serif text-3xl font-normal italic sm:text-4xl lg:text-5xl">
				{title}
			</h2>
			{description ? (
				<p className="text-muted-foreground text-sm sm:text-base">
					{description}
				</p>
			) : null}
		</div>
	);

	if (!actions) {
		return content;
	}

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			{content}
			{actions}
		</div>
	);
}
