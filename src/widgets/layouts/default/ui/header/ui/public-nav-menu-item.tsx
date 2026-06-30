"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import type { TResolvedNavItem } from "@/shared/types/navigation.types";
import { Badge } from "@/shared/ui";

import { NavEntryLabel } from "./nav-entry-label";

interface IPublicNavMenuItemProps {
	item: TResolvedNavItem;
}

function isExternalHref(href: string): boolean {
	return href.startsWith("http://") || href.startsWith("https://");
}

export const PublicNavMenuItem: FC<IPublicNavMenuItemProps> = ({ item }) => {
	const t = useTranslations("header");

	const className = cn(
		"flex w-full gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
		item.description ? "items-start" : "items-center",
		item.isSoon
			? "cursor-default opacity-60"
			: "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
	);

	const content = (
		<>
			<NavEntryLabel
				icon={item.icon}
				label={item.label}
				variant="dropdown"
				muted={item.isSoon}
				suffix={
					item.isSoon ? (
						<Badge
							variant="secondary"
							className="h-5 border-none px-1.5 py-0 text-[10px] font-medium"
						>
							{t("public.nav.coming_soon")}
						</Badge>
					) : null
				}
			/>
			{item.description ? (
				<span className="min-w-0">
					<span className="mt-0.5 block pl-10 text-xs leading-snug text-muted-foreground">
						{item.description}
					</span>
				</span>
			) : null}
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
