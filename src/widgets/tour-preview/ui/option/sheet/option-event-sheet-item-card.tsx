"use client";

import { type LucideIcon } from "lucide-react";
import { type FC } from "react";

import { Previewer } from "@/shared/ui";

interface IOptionEventSheetItemCardProps {
	icon: LucideIcon;
	title: string;
	subtitle?: string;
	badgeCount?: number | null;
	badgeLabel?: string;
	description: string;
}

export const OptionEventSheetItemCard: FC<IOptionEventSheetItemCardProps> = ({
	icon: Icon,
	title,
	subtitle,
	badgeCount,
	badgeLabel,
	description
}) => (
	<div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
		<div className="flex items-center gap-3">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
				<Icon className="size-5 text-primary" />
			</div>
			<div className="min-w-0 flex-1">
				{title ? (
					<p className="font-semibold leading-tight text-foreground">
						{title}
					</p>
				) : null}
				{subtitle ? (
					<p className="mt-0.5 text-xs text-muted-foreground">
						{subtitle}
					</p>
				) : null}
			</div>
			{badgeCount != null ? (
				<div className="flex shrink-0 flex-col items-end leading-none">
					<span className="text-2xl font-bold tabular-nums text-primary">
						{badgeCount}
					</span>
					{badgeLabel ? (
						<span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
							{badgeLabel}
						</span>
					) : null}
				</div>
			) : null}
		</div>
		{description ? (
			<Previewer
				text={description}
				className="mt-3 text-sm leading-relaxed text-muted-foreground"
			/>
		) : null}
	</div>
);
