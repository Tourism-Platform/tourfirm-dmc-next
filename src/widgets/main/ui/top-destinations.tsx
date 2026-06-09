"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Card } from "@/shared/ui";

import { TOP_DESTINATIONS_MOCK } from "../model";

export const TopDestinations: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<div className="flex items-end justify-between gap-4">
				<h2 className="text-xl font-semibold sm:text-2xl">
					{t("destinations.title")}
				</h2>
				<Link
					href={ENUM_PATH.MAIN.DESTINATIONS}
					className="text-primary shrink-0 text-sm font-medium"
				>
					{t("destinations.view_all")}
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
				{TOP_DESTINATIONS_MOCK.map((destination) => (
					<Link
						key={destination.id}
						href={ENUM_PATH.MAIN.CATALOG}
						className="group block"
					>
						<Card className="relative h-56 overflow-hidden p-0 transition-shadow group-hover:shadow-lg sm:h-72 md:h-80 lg:h-96 xl:h-120">
							<Image
								src={destination.imageUrl}
								alt={destination.name}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
							<div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-card/80 p-4 backdrop-blur-sm sm:gap-1.5 sm:p-5 lg:gap-2 lg:p-6">
								<p className="text-xl font-semibold uppercase leading-tight sm:text-2xl lg:text-3xl">
									{destination.name}
								</p>
								<p className="text-muted-foreground text-xs sm:text-sm">
									{t("destinations.count", {
										count: destination.count
									})}
								</p>
							</div>
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
};
