"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { isExternalHref } from "@/shared/lib/url/is-external-href";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TResolvedNavLink } from "@/shared/types/navigation.types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { DiscoveryViewAllFooter } from "./discovery-view-all-footer";
import { FlatDiscoveryNavColumns } from "./flat-discovery-nav-columns";
import { PublicNavMenuItem } from "./public-nav-menu-item";

const DEFAULT_LOGO_SRC = "/assets/images/logo.svg";

type TProps = {
	items: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	routesNav: TDiscoveryNavTree | null;
	experiencesNav: TDiscoveryNavTree | null;
	logoSrc?: string;
	brandName?: string;
};

export const PublicMobileNavMenu: FC<TProps> = ({
	items,
	destinationsNav,
	routesNav,
	experiencesNav,
	logoSrc = DEFAULT_LOGO_SRC,
	brandName = "TourLink"
}) => {
	const { header } = useUiContent();
	const nav = header.public.nav;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="md:hidden"
					aria-label={nav.mobileMenu}
				>
					<MenuIcon className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-full max-w-sm overflow-y-auto gap-0"
			>
				<SheetHeader className="border-b">
					<Link
						href={ENUM_PATH.MAIN.ROOT}
						className="flex shrink-0 items-center gap-2 pr-10"
					>
						<Image
							src={logoSrc}
							alt={brandName}
							width={48}
							height={48}
							className="h-10 w-auto"
							unoptimized={logoSrc.startsWith("http")}
						/>
						<span className="text-2xl font-semibold">
							<span className="text-foreground">Tour</span>
							<span className="text-[#37bffa]">Link</span>
						</span>
					</Link>
					<SheetTitle className="sr-only">
						{nav.mobileMenu}
					</SheetTitle>
				</SheetHeader>
				<Accordion type="multiple" className="w-full p-4">
					{items.map((entry) => {
						if (
							entry.variant === "destinations-mega" &&
							destinationsNav?.countries.length
						) {
							return (
								<AccordionItem
									key={entry.key}
									value={entry.key}
								>
									<AccordionTrigger>
										{entry.label}
									</AccordionTrigger>
									<AccordionContent>
										<ul className="flex flex-col gap-1">
											{destinationsNav.countries.map(
												(country) => (
													<li key={country.id}>
														<Link
															href={country.href}
															className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
														>
															{country.title}
														</Link>
													</li>
												)
											)}
										</ul>
										<DiscoveryViewAllFooter
											href={destinationsNav.rootHref}
											label={nav.destinations.viewAll}
											className="mt-2"
										/>
									</AccordionContent>
								</AccordionItem>
							);
						}

						if (
							entry.variant === "routes-mega" &&
							routesNav?.items.length
						) {
							return (
								<AccordionItem
									key={entry.key}
									value={entry.key}
								>
									<AccordionTrigger>
										{entry.label}
									</AccordionTrigger>
									<AccordionContent>
										<FlatDiscoveryNavColumns
											items={routesNav.items}
											columnTitle={
												nav.routes.columns.title
											}
											mobile
										/>
										<DiscoveryViewAllFooter
											href={routesNav.rootHref}
											label={nav.routes.viewAll}
											className="mt-2"
										/>
									</AccordionContent>
								</AccordionItem>
							);
						}

						if (
							entry.variant === "experiences-mega" &&
							experiencesNav?.items.length
						) {
							return (
								<AccordionItem
									key={entry.key}
									value={entry.key}
								>
									<AccordionTrigger>
										{entry.label}
									</AccordionTrigger>
									<AccordionContent>
										<FlatDiscoveryNavColumns
											items={experiencesNav.items}
											columnTitle={
												nav.experiences.columns.title
											}
											mobile
										/>
										<DiscoveryViewAllFooter
											href={experiencesNav.rootHref}
											label={nav.experiences.viewAll}
											className="mt-2"
										/>
									</AccordionContent>
								</AccordionItem>
							);
						}

						if (entry.sections.length === 0 && entry.href) {
							return isExternalHref(entry.href) ? (
								<a
									key={entry.key}
									href={entry.href}
									target={entry.target ?? "_blank"}
									rel="noopener noreferrer"
									className="block rounded-md py-4 text-sm font-semibold hover:bg-muted"
								>
									{entry.label}
								</a>
							) : (
								<Link
									key={entry.key}
									href={entry.href}
									className="block rounded-md py-4 text-sm font-semibold hover:bg-muted"
								>
									{entry.label}
								</Link>
							);
						}

						if (entry.sections.length) {
							return (
								<AccordionItem
									key={entry.key}
									value={entry.key}
								>
									<AccordionTrigger>
										{entry.label}
									</AccordionTrigger>
									<AccordionContent>
										<ul className="flex flex-col gap-1">
											{entry.sections.flatMap((section) =>
												section.items.map((item) => (
													<li key={item.key}>
														<PublicNavMenuItem
															item={item}
														/>
													</li>
												))
											)}
										</ul>
									</AccordionContent>
								</AccordionItem>
							);
						}

						return null;
					})}
				</Accordion>
			</SheetContent>
		</Sheet>
	);
};
