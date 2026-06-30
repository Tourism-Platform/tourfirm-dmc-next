"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { isExternalHref } from "@/shared/lib/url/is-external-href";
import { cn } from "@/shared/lib/utils";
import type { TResolvedNavItem } from "@/shared/types/navigation.types";
import { Badge } from "@/shared/ui";
import { NavIcon } from "@/shared/ui/nav-icon";

interface IPublicNavMenuItemProps {
	item: TResolvedNavItem;
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
			{item.icon ? (
				<span
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
						item.isSoon && "bg-muted/50 text-muted-foreground"
					)}
				>
					<NavIcon name={item.icon} className="size-4" />
				</span>
			) : null}
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="flex items-center gap-2">
					<span
						className={cn(
							"text-[13px] font-medium leading-tight",
							item.isSoon && "text-muted-foreground"
						)}
					>
						{item.label}
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
				{item.description ? (
					<span className="text-xs leading-snug text-muted-foreground">
						{item.description}
					</span>
				) : null}
			</span>
		</>
	);

	if (item.isSoon || !item.href) {
		return <span className={className}>{content}</span>;
	}

	if (isExternalHref(item.href)) {
		return (
			<a
				href={item.href}
				target={item.target ?? "_blank"}
				rel="noopener noreferrer"
				className={className}
			>
				{content}
			</a>
		);
	}

	return (
		<Link href={item.href} className={className}>
			{content}
		</Link>
	);
};
