import { type FC } from "react";

import { Separator } from "@/shared/ui";

import type { ICatalogPreviewTourData } from "@/entities/tour/catalog";

import { CatalogTourAdditionalInfo } from "./catalog-tour-additional-info";
import { CatalogTourAmenities } from "./catalog-tour-amenities";
import { CatalogTourCancellation } from "./catalog-tour-cancellation";
import { CatalogTourMeta } from "./catalog-tour-meta";
import { CatalogTourOverview } from "./catalog-tour-overview";
import { CatalogTourPhotos } from "./catalog-tour-photos";
import { CatalogTourPickup } from "./catalog-tour-pickup";

interface ICatalogTourInformationSectionsProps {
	data?: ICatalogPreviewTourData;
}

export const CatalogTourInformationSections: FC<
	ICatalogTourInformationSectionsProps
> = ({ data }) => {
	if (!data) return null;

	return (
		<div className="flex flex-col gap-8">
			<CatalogTourPhotos data={data} />
			<Separator />
			<CatalogTourOverview data={data} />
			<Separator />
			<CatalogTourMeta data={data} />
			<Separator />
			<CatalogTourAmenities data={data} />
			<Separator />
			<CatalogTourPickup data={data} />
			<Separator />
			<CatalogTourCancellation data={data} />
			<Separator />
			<CatalogTourAdditionalInfo data={data} />
		</div>
	);
};
