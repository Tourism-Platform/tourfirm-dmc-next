"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

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

import { DiscoveryViewAllFooter } from "./discovery-view-all-footer";
import { FlatDiscoveryNavColumns } from "./flat-discovery-nav-columns";
import { PublicNavMenuItem } from "./public-nav-menu-item";

type TProps = {
	items: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	routesNav: TDiscoveryNavTree | null;
	experiencesNav: TDiscoveryNavTree | null;
};

export const PublicMobileNavMenu: FC<TProps> = ({
	items,
	destinationsNav,
	routesNav,
	experiencesNav
}) => {
	const t = useTranslations("header.public.nav");
	const tRoutes = useTranslations("header.public.nav.routes");
	const tExperiences = useTranslations("header.public.nav.experiences");
	const tDestinations = useTranslations("header.public.nav.destinations");

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="md:hidden"
					aria-label={t("mobile_menu")}
				>
					<MenuIcon className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-full max-w-sm overflow-y-auto"
			>
				<SheetHeader>
					<SheetTitle>{t("mobile_menu")}</SheetTitle>
				</SheetHeader>
				<Accordion type="multiple" className="mt-4 w-full">
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
											label={tDestinations("view_all")}
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
											columnTitle={tRoutes(
												"columns.title"
											)}
											mobile
										/>
										<DiscoveryViewAllFooter
											href={routesNav.rootHref}
											label={tRoutes("view_all")}
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
											columnTitle={tExperiences(
												"columns.title"
											)}
											mobile
										/>
										<DiscoveryViewAllFooter
											href={experiencesNav.rootHref}
											label={tExperiences("view_all")}
											className="mt-2"
										/>
									</AccordionContent>
								</AccordionItem>
							);
						}

						if (entry.sections.length === 0 && entry.href) {
							return (
								<AccordionItem
									key={entry.key}
									value={entry.key}
								>
									<AccordionTrigger asChild>
										{isExternalHref(entry.href) ? (
											<a
												href={entry.href}
												target={
													entry.target ?? "_blank"
												}
												rel="noopener noreferrer"
												className="flex flex-1 items-center py-4 text-sm font-medium"
											>
												{entry.label}
											</a>
										) : (
											<Link
												href={entry.href}
												className="flex flex-1 items-center py-4 text-sm font-medium"
											>
												{entry.label}
											</Link>
										)}
									</AccordionTrigger>
								</AccordionItem>
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
