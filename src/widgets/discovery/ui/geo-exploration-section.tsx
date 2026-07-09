import { GeoDiscoveryCard } from "@/shared/ui/cards";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";

import type { TGeoCardData } from "@/cms/lib/map-discovery-cards";

type TGeoGroup = {
	title: string;
	items: TGeoCardData[];
};

type TProps = {
	countries: TGeoCardData[];
	cities: TGeoCardData[];
	attractions: TGeoCardData[];
};

function GeoGroup({ title, items }: TGeoGroup) {
	if (!items.length) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-lg font-semibold">{title}</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{items.map((item) => (
					<GeoDiscoveryCard
						key={`${title}-${item.href}`}
						data={item}
					/>
				))}
			</div>
		</div>
	);
}

export function GeoExplorationSection({
	countries,
	cities,
	attractions
}: TProps) {
	if (!countries.length && !cities.length && !attractions.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-8">
			<CustomSectionHeader
				eyebrow="Explore"
				title="Places along this route"
				description="Countries, cities, and landmarks connected to this journey."
			/>
			<GeoGroup title="Countries" items={countries} />
			<GeoGroup title="Cities" items={cities} />
			<GeoGroup title="Attractions" items={attractions} />
		</section>
	);
}
