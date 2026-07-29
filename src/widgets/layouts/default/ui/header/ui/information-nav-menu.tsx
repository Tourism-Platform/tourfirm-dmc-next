"use client";

import { type FC, useMemo, useState } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import type {
	TInformationNavArea,
	TInformationNavTree
} from "@/shared/types/information-nav.types";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { DiscoveryViewAllFooter } from "./discovery-view-all-footer";

type TProps = {
	label: string;
	tree: TInformationNavTree;
};

function getDefaultArea(
	areas: TInformationNavArea[]
): TInformationNavArea | null {
	return areas[0] ?? null;
}

export const InformationNavMenu: FC<TProps> = ({ label, tree }) => {
	const { header } = useUiContent();
	const t = header.public.nav.information ?? {
		areasLabel: "Sections",
		viewAll: "View all"
	};
	const defaultArea = useMemo(() => getDefaultArea(tree.areas), [tree.areas]);
	const [activeAreaKey, setActiveAreaKey] = useState<string | null>(
		defaultArea?.key ?? null
	);

	const activeArea = useMemo(() => {
		return (
			tree.areas.find((area) => area.key === activeAreaKey) ?? defaultArea
		);
	}, [activeAreaKey, defaultArea, tree.areas]);

	if (!tree.areas.length) {
		return null;
	}

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger aria-haspopup="menu">
				{label}
			</NavigationMenuTrigger>
			<NavigationMenuContent className="z-50 min-w-[560px] p-0 shadow-lg">
				<div className="grid grid-cols-2 gap-6 p-5">
					<div>
						<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
							{t.areasLabel}
						</p>
						<ul
							className="mt-3 flex flex-col gap-0.5"
							role="listbox"
						>
							{tree.areas.map((area) => {
								const isActive = activeArea?.key === area.key;

								return (
									<li key={area.key}>
										<Link
											href={area.hubHref}
											role="option"
											aria-selected={isActive}
											className={cn(
												"block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
												isActive ? "bg-muted" : null
											)}
											onMouseEnter={() =>
												setActiveAreaKey(area.key)
											}
											onFocus={() =>
												setActiveAreaKey(area.key)
											}
										>
											{area.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>

					<div>
						{activeArea ? (
							<>
								<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
									{activeArea.label}
								</p>
								{activeArea.items.length ? (
									<ul className="mt-3 flex flex-col gap-0.5">
										{activeArea.items.map((item) => (
											<li key={item.id}>
												<Link
													href={item.href}
													className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
												>
													{item.title}
												</Link>
											</li>
										))}
									</ul>
								) : (
									<p className="mt-3 px-3 text-sm text-muted-foreground">
										—
									</p>
								)}
							</>
						) : null}
					</div>
				</div>
				{activeArea ? (
					<DiscoveryViewAllFooter
						href={activeArea.hubHref}
						label={t.viewAll}
					/>
				) : null}
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};
