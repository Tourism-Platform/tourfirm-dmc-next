"use client";

import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TResolvedNavLink } from "@/shared/types/navigation.types";
import { LanguageToggle, ThemeToggle } from "@/shared/ui";

import { PublicMobileNavMenu } from "./ui/public-mobile-nav-menu";
import { PublicNavMenu } from "./ui/public-nav-menu";

const DEFAULT_LOGO_SRC = "/assets/images/logo.svg";

type TProps = {
	navItems: TResolvedNavLink[];
	destinationsNav?: TDestinationsNavTree | null;
	routesNav?: TDiscoveryNavTree | null;
	experiencesNav?: TDiscoveryNavTree | null;
	logoSrc?: string;
	logoAlt?: string;
};

export const HeaderDefault: FC<TProps> = ({
	navItems,
	destinationsNav = null,
	routesNav = null,
	experiencesNav = null,
	logoSrc = DEFAULT_LOGO_SRC,
	logoAlt = "TourLink"
}) => {
	const isRemoteLogo = logoSrc.startsWith("http");

	return (
		<header className="sticky top-0 z-40 border-b bg-card/75 px-4 shadow-black/6.5 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 lg:px-4 xl:px-8">
				<div className="flex items-center gap-2 sm:gap-4">
					<PublicMobileNavMenu
						items={navItems}
						destinationsNav={destinationsNav}
						routesNav={routesNav}
						experiencesNav={experiencesNav}
					/>
					<Link
						href={ENUM_PATH.MAIN.ROOT}
						className="flex shrink-0 items-center gap-2"
					>
						<Image
							src={logoSrc}
							alt={logoAlt}
							width={48}
							height={48}
							className="h-10 w-auto"
							unoptimized={isRemoteLogo}
						/>
						<span className="text-2xl font-semibold">
							<span className="text-foreground">Tour</span>
							<span className="text-[#37bffa]">Link</span>
						</span>
					</Link>
					<PublicNavMenu
						items={navItems}
						destinationsNav={destinationsNav}
						routesNav={routesNav}
						experiencesNav={experiencesNav}
					/>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</header>
	);
};
