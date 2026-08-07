"use client";

import { type FC } from "react";

import { Badge, Previewer, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourData } from "@/entities/tour";

import { PICKUP_ICONS, getPickupLabel } from "../../model";

interface IPreviewTourPickupProps {
	data?: IPreviewTourData;
}

const PreviewTourPickupBase: FC<IPreviewTourPickupProps> = ({ data }) => {
	const { preview } = useUiContent();
	const texts = preview.tour.sections.meetingPickup;

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{texts.title}</h2>

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
							{Icon ? <Icon className="size-4" /> : null}
							{getPickupLabel(preview.labels.pickup, type)}
						</Badge>
					);
				})}
			</div>

			<div className="flex flex-col gap-3">
				<div>
					<p className="text-sm font-semibold">
						{texts.pickupDetails}:
					</p>
					<Previewer text={data.pickup_description} />
				</div>
			</div>
		</div>
	);
};

export const PreviewTourPickup = withErrorBoundary(PreviewTourPickupBase);
