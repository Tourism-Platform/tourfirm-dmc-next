"use client";

import type { FC } from "react";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { DiscoveryViewAllFooter } from "./discovery-view-all-footer";
import { FlatDiscoveryNavColumns } from "./flat-discovery-nav-columns";

type TProps = {
	label: string;
	tree: TDiscoveryNavTree;
};

export const ExperiencesNavMenu: FC<TProps> = ({ label, tree }) => {
	const { header } = useUiContent();
	const t = header.public.nav.experiences;

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger aria-haspopup="menu">
				{label}
			</NavigationMenuTrigger>
			<NavigationMenuContent className="z-50 min-w-[720px] p-0 shadow-lg">
				<div className="p-5">
					<FlatDiscoveryNavColumns
						items={tree.items}
						columnTitle={t.columns.title}
					/>
				</div>
				<DiscoveryViewAllFooter
					href={tree.rootHref}
					label={t.viewAll}
				/>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};
