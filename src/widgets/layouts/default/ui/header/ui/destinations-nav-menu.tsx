"use client";

import { useTranslations } from "next-intl";
import { type FC, useCallback, useMemo, useState } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import type {
	TDestinationsNavCountry,
	TDestinationsNavRegion,
	TDestinationsNavTree
} from "@/shared/types/destinations-nav.types";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger,
	Separator
} from "@/shared/ui";

interface IDestinationsNavMenuProps {
	label: string;
	tree: TDestinationsNavTree;
}

function getDefaultCountry(
	countries: TDestinationsNavCountry[]
): TDestinationsNavCountry | null {
	return countries[0] ?? null;
}

function getDefaultRegion(
	country: TDestinationsNavCountry | null
): TDestinationsNavRegion | null {
	return country?.regions[0] ?? null;
}

export const DestinationsNavMenu: FC<IDestinationsNavMenuProps> = ({
	label,
	tree
}) => {
	const t = useTranslations("header.public.nav.destinations");
	const defaultCountry = useMemo(
		() => getDefaultCountry(tree.countries),
		[tree.countries]
	);
	const defaultRegion = useMemo(
		() => getDefaultRegion(defaultCountry),
		[defaultCountry]
	);

	const [activeCountryId, setActiveCountryId] = useState<string | null>(
		defaultCountry?.id ?? null
	);
	const [activeRegionId, setActiveRegionId] = useState<string | null>(
		defaultRegion?.id ?? null
	);

	const activeCountry = useMemo(() => {
		return (
			tree.countries.find((country) => country.id === activeCountryId) ??
			defaultCountry
		);
	}, [activeCountryId, defaultCountry, tree.countries]);

	const activeRegion = useMemo(() => {
		if (!activeCountry) {
			return null;
		}

		return (
			activeCountry.regions.find(
				(region) => region.id === activeRegionId
			) ??
			activeCountry.regions[0] ??
			null
		);
	}, [activeCountry, activeRegionId]);

	const handleCountryActivate = useCallback(
		(country: TDestinationsNavCountry) => {
			setActiveCountryId(country.id);
			setActiveRegionId(country.regions[0]?.id ?? null);
		},
		[]
	);

	const handleRegionActivate = useCallback(
		(region: TDestinationsNavRegion) => {
			setActiveRegionId(region.id);
		},
		[]
	);

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger aria-haspopup="menu">
				{label}
			</NavigationMenuTrigger>
			<NavigationMenuContent className="z-50 min-w-[720px] p-0 shadow-lg">
				<div className="grid grid-cols-3 gap-6 p-5">
					<div>
						<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
							{t("columns.countries.title")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{t("columns.countries.subtitle")}
						</p>
						<ul
							className="mt-3 flex flex-col gap-0.5"
							role="listbox"
						>
							{tree.countries.map((country) => {
								const isActive =
									activeCountry?.id === country.id;

								return (
									<li key={country.id}>
										<Link
											href={country.href}
											role="option"
											aria-selected={isActive}
											className={cn(
												"block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
												isActive
													? "bg-muted"
													: "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
											)}
											onMouseEnter={() =>
												handleCountryActivate(country)
											}
											onFocus={() =>
												handleCountryActivate(country)
											}
										>
											{country.title}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>

					<div>
						<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
							{t("columns.regions.title")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{t("columns.regions.subtitle")}
						</p>
						{activeCountry?.regions.length ? (
							<ul
								className="mt-3 flex flex-col gap-0.5"
								role="listbox"
							>
								{activeCountry.regions.map((region) => {
									const isActive =
										activeRegion?.id === region.id;

									return (
										<li key={region.id}>
											<Link
												href={region.href}
												role="option"
												aria-selected={isActive}
												className={cn(
													"block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
													// isActive
													// 	? "bg-muted"
													// 	: "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
												)}
												onMouseEnter={() =>
													handleRegionActivate(region)
												}
												onFocus={() =>
													handleRegionActivate(region)
												}
											>
												{region.title}
											</Link>
										</li>
									);
								})}
							</ul>
						) : null}
					</div>

					<div>
						<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
							{t("columns.cities.title")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{t("columns.cities.subtitle")}
						</p>
						{activeRegion?.cities.length ? (
							<ul
								className="mt-3 flex flex-col gap-0.5"
								role="listbox"
							>
								{activeRegion.cities.map((city) => (
									<li key={city.id}>
										<Link
											href={city.href}
											className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
										>
											{city.title}
										</Link>
									</li>
								))}
							</ul>
						) : null}
					</div>
				</div>

				<Separator />
				<div className="px-5 py-3">
					<Link
						href={tree.rootHref}
						className="text-sm font-medium text-foreground transition-colors hover:text-primary"
					>
						{t("view_all")}
					</Link>
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};
