import type { TPublicTourCatalogSchema } from "@/shared/api";

const baseTour = (
	partial: Partial<TPublicTourCatalogSchema> &
		Pick<TPublicTourCatalogSchema, "tour_id" | "title" | "cover_image_url">
): TPublicTourCatalogSchema => ({
	description: partial.description ?? null,
	days: partial.days ?? 2,
	nights: partial.nights ?? 1,
	duration_hours: null,
	age_from: 12,
	age_to: 70,
	group_size: 15,
	group_size_min: 2,
	categories: partial.categories ?? ["cultural_historical"],
	tour_type: partial.tour_type ?? "group",
	landing_photos: [],
	cities: partial.cities ?? ["Samarkand"],
	languages: partial.languages ?? ["en"],
	price_range: partial.price_range ?? {
		min: 800,
		max: 1200,
		currency: "USD"
	},
	price_per_person: partial.price_per_person ?? null,
	option_count: partial.option_count ?? 1,
	...partial
});

export const POPULAR_TOURS_MOCK: TPublicTourCatalogSchema[] = [
	baseTour({
		tour_id: "popular-tour-1",
		title: "Tour to Fergana Valley",
		cover_image_url: "/assets/images/city/fergana.jpg",
		description:
			"Discover the heart of the Fergana Valley with its silk workshops and mountain landscapes.",
		cities: ["Fergana", "Margilan"],
		price_per_person: { min: 1009, max: 1500, currency: "USD" }
	}),
	baseTour({
		tour_id: "popular-tour-2",
		title: "Samarkand Night Tour",
		cover_image_url: "/assets/images/city/samarkand.jpg",
		description:
			"Experience the magic of Samarkand's illuminated monuments under the starlit sky.",
		days: 1,
		nights: 0,
		cities: ["Samarkand"],
		price_per_person: { min: 850, max: 1200, currency: "USD" }
	}),
	baseTour({
		tour_id: "popular-tour-3",
		title: "Bukhara Bazaar Walk",
		cover_image_url: "/assets/images/city/bukhara.jpg",
		description:
			"A guided walk through the ancient trading domes and vibrant spice markets of Bukhara.",
		days: 1,
		nights: 0,
		cities: ["Bukhara"],
		tour_type: "private",
		price_per_person: { min: 650, max: 900, currency: "USD" }
	}),
	baseTour({
		tour_id: "popular-tour-4",
		title: "Khiva Sunrise Masterclass",
		cover_image_url: "/assets/images/city/khiva.jpg",
		description:
			"Capture the first light on the minarets of Khiva followed by a traditional bread-making workshop.",
		cities: ["Khiva"],
		option_count: 3,
		price_per_person: { min: 1200, max: 1800, currency: "USD" }
	})
];

export const SPECIAL_OFFERS_MOCK: TPublicTourCatalogSchema[] =
	POPULAR_TOURS_MOCK;
