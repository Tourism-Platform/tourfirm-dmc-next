"use client";

import type { FC, ReactNode } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { isExternalHref } from "@/shared/lib/url/is-external-href";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TInformationNavTree } from "@/shared/types/information-nav.types";
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

import { DestinationsNavMenu } from "./destinations-nav-menu";
import { ExperiencesNavMenu } from "./experiences-nav-menu";
import { InformationNavMenu } from "./information-nav-menu";
import { PublicNavMenuItem } from "./public-nav-menu-item";
import { RoutesNavMenu } from "./routes-nav-menu";

interface IPublicNavMenuProps {
	items: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	routesNav: TDiscoveryNavTree | null;
	experiencesNav: TDiscoveryNavTree | null;
	informationNav: TInformationNavTree | null;
	className?: string;
}

export const PublicNavMenu: FC<IPublicNavMenuProps> = ({
	items,
	destinationsNav,
	routesNav,
	experiencesNav,
	informationNav,
	className
}) => {
	const renderEntry = (entry: TResolvedNavLink): ReactNode => {
		if (
			entry.variant === "destinations-mega" &&
			destinationsNav?.countries.length
		) {
			return (
				<DestinationsNavMenu
					key={entry.key}
					label={entry.label}
					tree={destinationsNav}
				/>
			);
		}

		if (entry.variant === "routes-mega" && routesNav?.items.length) {
			return (
				<RoutesNavMenu
					key={entry.key}
					label={entry.label}
					tree={routesNav}
				/>
			);
		}

		if (
			entry.variant === "experiences-mega" &&
			experiencesNav?.items.length
		) {
			return (
				<ExperiencesNavMenu
					key={entry.key}
					label={entry.label}
					tree={experiencesNav}
				/>
			);
		}

		if (
			entry.variant === "information-mega" &&
			informationNav?.areas.length
		) {
			return (
				<InformationNavMenu
					key={entry.key}
					label={entry.label}
					tree={informationNav}
				/>
			);
		}

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
				<NavigationMenuTrigger>{entry.label}</NavigationMenuTrigger>
				<NavigationMenuContent className="z-50 min-w-60 p-2 shadow-lg">
					{entry.sections.map((section, sectionIndex) => (
						<div key={section.label ?? sectionIndex}>
							{sectionIndex > 0 && <Separator className="my-1" />}
							{section.label && (
								<p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
									{section.label}
								</p>
							)}
							<ul className="flex flex-col gap-0.5">
								{section.items.map((item) => (
									<li key={item.key}>
										<PublicNavMenuItem item={item} />
									</li>
								))}
							</ul>
						</div>
					))}
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	};

	return (
		<NavigationMenu
			viewport={false}
			style={{ justifyContent: "unset" }}
			delayDuration={200}
			className={cn("max-w-none grid w-full max-md:hidden", className)}
		>
			<NavigationMenuList
				className={cn(
					"grid w-full flex-none list-none gap-y-0.5",
					"grid-cols-[repeat(4,max-content)] justify-between justify-items-center items-center",
					// Two-row hover: path to top dropdown crosses bottom items — ignore them while open
					"[&:has([data-state=open])_[data-slot=navigation-menu-item]:not(:has([data-state=open]))]:pointer-events-none",
					"[&>*:nth-child(4n+3)_[data-slot=navigation-menu-content]]:left-auto",
					"[&>*:nth-child(4n+3)_[data-slot=navigation-menu-content]]:right-0",
					"[&>*:nth-child(4n+4)_[data-slot=navigation-menu-content]]:left-auto",
					"[&>*:nth-child(4n+4)_[data-slot=navigation-menu-content]]:right-0"
				)}
			>
				{items.map(renderEntry)}
			</NavigationMenuList>
		</NavigationMenu>
	);
};
