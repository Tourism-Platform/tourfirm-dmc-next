"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	Separator,
	navigationMenuTriggerStyle
} from "@/shared/ui";

import type { IPublicNavLink } from "../model";

import { PublicNavMenuItem } from "./public-nav-menu-item";

interface IPublicNavMenuProps {
	items: IPublicNavLink[];
}

export const PublicNavMenu: FC<IPublicNavMenuProps> = ({ items }) => {
	const t = useTranslations("header");

	return (
		<NavigationMenu viewport={false} className="max-md:hidden">
			<NavigationMenuList className="gap-1">
				{items.map((entry) => {
					if (entry.sections.length === 0 && entry.path) {
						return (
							<NavigationMenuItem key={entry.label} asChild>
								<Link
									href={entry.path}
									className={navigationMenuTriggerStyle()}
								>
									{t(entry.label)}
								</Link>
							</NavigationMenuItem>
						);
					}

					return (
						<NavigationMenuItem key={entry.label}>
							<NavigationMenuTrigger>
								{t(entry.label)}
							</NavigationMenuTrigger>
							<NavigationMenuContent className="z-50 min-w-60 p-2 shadow-lg">
								{entry.sections.map((section, sectionIndex) => (
									<div key={section.label ?? sectionIndex}>
										{sectionIndex > 0 && (
											<Separator className="my-1" />
										)}
										{section.label && (
											<p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
												{t(section.label)}
											</p>
										)}
										<ul className="flex flex-col gap-0.5">
											{section.items.map((item) => (
												<li key={item.label}>
													<PublicNavMenuItem
														item={item}
													/>
												</li>
											))}
										</ul>
									</div>
								))}
							</NavigationMenuContent>
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
};
