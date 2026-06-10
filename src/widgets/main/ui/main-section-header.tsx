import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

type TMainSectionHeaderProps = {
	eyebrow: string;
	title: ReactNode;
	description?: string;
	className?: string;
};

export function MainSectionHeader({
	eyebrow,
	title,
	description,
	className
}: TMainSectionHeaderProps) {
	return (
		<div className={cn("flex max-w-3xl flex-col gap-3", className)}>
			<p className="text-primary text-xs font-semibold uppercase tracking-widest">
				{eyebrow}
			</p>
			<h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
				{title}
			</h2>
			{description ? (
				<p className="text-muted-foreground text-sm sm:text-base">
					{description}
				</p>
			) : null}
		</div>
	);
}
