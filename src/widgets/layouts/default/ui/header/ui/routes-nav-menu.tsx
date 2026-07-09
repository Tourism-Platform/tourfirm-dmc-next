"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger
} from "@/shared/ui";

import { DiscoveryViewAllFooter } from "./discovery-view-all-footer";
import { FlatDiscoveryNavColumns } from "./flat-discovery-nav-columns";

type TProps = {
	label: string;
	tree: TDiscoveryNavTree;
};

export const RoutesNavMenu: FC<TProps> = ({ label, tree }) => {
	const t = useTranslations("header.public.nav.routes");

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger aria-haspopup="menu">
				{label}
			</NavigationMenuTrigger>
			<NavigationMenuContent className="z-50 min-w-[720px] p-0 shadow-lg">
				<div className="p-5">
					<FlatDiscoveryNavColumns
						items={tree.items}
						columnTitle={t("columns.title")}
					/>
				</div>
				<DiscoveryViewAllFooter
					href={tree.rootHref}
					label={t("view_all")}
				/>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};
