"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type FC } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	withErrorBoundary
} from "@/shared/ui";
import { Badge } from "@/shared/ui/shadcn-ui/badge";
import { Button } from "@/shared/ui/shadcn-ui/button";

import type { ICatalogPreviewOptionCard } from "@/entities/tour/catalog";

interface ICatalogTourOptionCardProps {
	option: ICatalogPreviewOptionCard;
}

export const CatalogTourOptionCardBase: FC<ICatalogTourOptionCardProps> = ({
	option
}) => {
	const t = useTranslations("catalog_tour_page");
	const { tourId = "" } = useParams<{ tourId: string }>();

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col lg:flex-row gap-6">
					<div className="flex-1 flex flex-col gap-4">
						<div className="gap-3 grid">
							<Badge>
								<CardTitle>{option.title}</CardTitle>
							</Badge>
							<CardDescription>
								{option.description}
							</CardDescription>
						</div>

						<div className="mt-auto flex items-end justify-between gap-4">
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
									{t("sections.itinerary.card.from")}
								</p>
								<p className="text-xl font-bold">
									{option.price}{" "}
									<span className="text-base font-normal">
										{t(
											"sections.itinerary.card.per_person"
										)}
									</span>
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{t("sections.itinerary.card.price_depends")}
								</p>
							</div>

							<Button
								asChild
								className="bg-blue-400 hover:bg-blue-500 text-white shrink-0"
							>
								<Link
									href={buildRoute(
										ENUM_PATH.MAIN.CATALOG.TOUR_OPTION,
										{ tourId, optionId: option.id }
									)}
								>
									{t("sections.itinerary.card.book_package")}{" "}
									<span className="ml-2">→</span>
								</Link>
							</Button>
						</div>
					</div>

					<div className="w-full lg:w-[320px] shrink-0">
						<img
							src={option.image}
							alt={option.title}
							className="w-full h-[240px] object-cover rounded-xl"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const CatalogTourOptionCard = withErrorBoundary(
	CatalogTourOptionCardBase
);
