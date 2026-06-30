"use client";

import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { isExternalHref } from "@/shared/lib/url/is-external-href";
import type { TResolvedNavLink } from "@/shared/types/navigation.types";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	Separator,
	navigationMenuTriggerStyle
} from "@/shared/ui";

import { PublicNavMenuItem } from "./public-nav-menu-item";

interface IPublicNavMenuProps {
	items: TResolvedNavLink[];
}

export const PublicNavMenu: FC<IPublicNavMenuProps> = ({ items }) => {
	return (
		<NavigationMenu viewport={false} className="max-md:hidden">
			<NavigationMenuList className="gap-1">
				{items.map((entry) => {
					if (entry.sections.length === 0 && entry.href) {
						if (isExternalHref(entry.href)) {
							return (
								<NavigationMenuItem key={entry.key} asChild>
									<a
										href={entry.href}
										target={entry.target ?? "_blank"}
										rel="noopener noreferrer"
										className={navigationMenuTriggerStyle()}
									>
										{entry.label}
									</a>
								</NavigationMenuItem>
							);
						}

						return (
							<NavigationMenuItem key={entry.key} asChild>
								<Link
									href={entry.href}
									className={navigationMenuTriggerStyle()}
								>
									{entry.label}
								</Link>
							</NavigationMenuItem>
						);
					}

					return (
						<NavigationMenuItem key={entry.key}>
							<NavigationMenuTrigger>
								{entry.label}
							</NavigationMenuTrigger>
							<NavigationMenuContent className="z-50 min-w-60 p-2 shadow-lg">
								{entry.sections.map((section, sectionIndex) => (
									<div key={section.label ?? sectionIndex}>
										{sectionIndex > 0 && (
											<Separator className="my-1" />
										)}
										{section.label && (
											<p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
												{section.label}
											</p>
										)}
										<ul className="flex flex-col gap-0.5">
											{section.items.map((item) => (
												<li key={item.key}>
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
