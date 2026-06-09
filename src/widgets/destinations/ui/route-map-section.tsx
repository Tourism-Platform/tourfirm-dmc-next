"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { DESTINATIONS_ROUTE_MAP_IMAGE } from "../model";

import { DestinationsSectionHeader } from "./destinations-section-header";

export const RouteMapSection: FC = () => {
	const t = useTranslations("destinations_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<DestinationsSectionHeader
				eyebrow={t("route_map.eyebrow")}
				title={t("route_map.title")}
				description={t("route_map.description")}
			/>
			<div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl border">
				<Image
					src={DESTINATIONS_ROUTE_MAP_IMAGE}
					alt={t("route_map.placeholder")}
					fill
					className="object-cover opacity-60"
					sizes="(max-width: 1280px) 100vw, 1280px"
				/>
				<div className="absolute inset-0 flex items-center justify-center bg-black/20 p-6">
					<p className="text-muted-foreground max-w-md text-center text-sm sm:text-base">
						{t("route_map.placeholder")}
					</p>
				</div>
			</div>
		</section>
	);
};
