"use client";

import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { LanguageToggle, ThemeToggle } from "@/shared/ui";

import { PUBLIC_NAV_ITEMS } from "./model";
import { PublicNavMenu } from "./ui/public-nav-menu";

const LOGO_SRC = "/assets/images/logo.svg";

export const HeaderDefault: FC = () => {
	return (
		<header className="sticky top-0 z-40 border-b bg-card/75 px-4 shadow-black/6.5 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 lg:px-4 xl:px-8">
				<div className="flex items-center gap-4">
					<Link
						href={ENUM_PATH.MAIN.ROOT}
						className="flex shrink-0 items-center gap-2"
					>
						<Image
							src={LOGO_SRC}
							alt="TourLink"
							width={48}
							height={48}
							className="h-10 w-auto"
						/>
						<span className="text-2xl font-semibold">
							<span className="text-foreground">Tour</span>
							<span className="text-[#37bffa]">Link</span>
						</span>
					</Link>
					<PublicNavMenu items={PUBLIC_NAV_ITEMS} />
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</header>
	);
};
