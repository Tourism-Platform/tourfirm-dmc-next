"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import type { IPublicNavItem } from "../model";

interface IPublicNavMenuItemProps {
	item: IPublicNavItem;
}

export const PublicNavMenuItem: FC<IPublicNavMenuItemProps> = ({ item }) => {
	const t = useTranslations("header");

	const className = cn(
		"flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
		item.isSoon
			? "cursor-default opacity-60"
			: "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
	);

	const content = (
		<>
			<span
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
					item.isSoon && "bg-muted/50 text-muted-foreground"
				)}
			>
				<item.icon className="size-4" />
			</span>
			<span className="min-w-0">
				<span className="flex items-center gap-2">
					<span
						className={cn(
							"block text-[13px] font-medium leading-tight",
							item.isSoon && "text-muted-foreground"
						)}
					>
						{t(item.label)}
					</span>
					{item.isSoon ? (
						<Badge
							variant="secondary"
							className="h-5 border-none px-1.5 py-0 text-[10px] font-medium"
						>
							{t("public.nav.coming_soon")}
						</Badge>
					) : null}
				</span>
				<span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
					{t(item.description)}
				</span>
			</span>
		</>
	);

	if (item.isSoon || !item.path) {
		return <span className={className}>{content}</span>;
	}

	return (
		<Link href={item.path} className={className}>
			{content}
		</Link>
	);
};
