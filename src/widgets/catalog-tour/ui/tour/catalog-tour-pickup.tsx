"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { Badge, Previewer, withErrorBoundary } from "@/shared/ui";
import { useValueToTranslateLabel } from "@/shared/utils";

import {
	CATALOG_PICKUP_TYPE_LABELS,
	type ICatalogPreviewTourData
} from "@/entities/tour/catalog";

import { PICKUP_ICONS } from "../../model/config/pickup.config";

interface ICatalogTourPickupProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourPickupBase: FC<ICatalogTourPickupProps> = ({ data }) => {
	const t = useTranslations("catalog_tour_page");
	const pickupLabels = useValueToTranslateLabel(CATALOG_PICKUP_TYPE_LABELS);

	if (!data) return null;

	const getLabel = (
		value: string,
		labels: { value: string; label: string }[]
	) => labels.find((l) => l.value === value)?.label ?? value;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{t("sections.meeting_pickup.title")}
			</h2>

			<div className="flex flex-wrap gap-2">
				{data.pickup_type.map((type) => {
					const Icon = PICKUP_ICONS[type];
					return (
						<Badge
							key={type}
							variant="outline"
							size="lg"
							className="flex items-center gap-2"
						>
							{Icon && <Icon className="w-4 h-4" />}
							{getLabel(type, pickupLabels)}
						</Badge>
					);
				})}
			</div>

			<div className="flex flex-col gap-3">
				<div>
					<p className="font-semibold text-sm">
						{t("sections.meeting_pickup.pickup_details")}:
					</p>
					<Previewer text={data.pickup_description} />
				</div>
			</div>
		</div>
	);
};

export const CatalogTourPickup = withErrorBoundary(CatalogTourPickupBase);
