"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger
} from "@/shared/ui";

import type { INavItemBase } from "../model";

interface INavMenuProps {
	navItems: INavItemBase[];
}

export const NavMenu: FC<INavMenuProps> = ({ navItems }) => {
	const t = useTranslations("header");
	return (
		<NavigationMenu viewport={false} className="max-md:hidden">
			<NavigationMenuList className="gap-2">
				{navItems.map((link, index) => (
					<NavigationMenuItem key={index}>
						{link.submenu ? (
							<>
								<NavigationMenuTrigger className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
									{t(link.label)}
								</NavigationMenuTrigger>
								<NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
									<ul
										className={cn(
											link.type === "description"
												? "min-w-64"
												: "min-w-48"
										)}
									>
										{link?.items?.map((item) => (
											<NavigationMenuItem
												key={item?.href}
												asChild
											>
												<Link
													href={item.href}
													className="p-1.5 text-muted-foreground hover:text-foreground flex items-center gap-2 hover:bg-accent rounded-sm text-sm"
												>
													{item?.icon && (
														<item.icon className="w-3 h-3" />
													)}
													<span>{t(item.label)}</span>
												</Link>
											</NavigationMenuItem>
										))}
									</ul>
								</NavigationMenuContent>
							</>
						) : (
							<NavigationMenuItem asChild>
								<Link
									href={link?.href || "#"}
									className="p-1.5 text-muted-foreground hover:text-foreground flex items-center gap-2 hover:bg-accent rounded-sm text-sm"
								>
									{t(link.label)}
								</Link>
							</NavigationMenuItem>
						)}
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};
