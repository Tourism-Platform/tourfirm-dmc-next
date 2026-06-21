import type { ICatalogTourBackend } from "../types";

export const POPULAR_TOURS_MOCK: ICatalogTourBackend[] = [
	{
		id: "9f2b3d82-5c4d-4b9f-9f7a-1a42e71d1b11",
		title: "Tour to Fergana Valley",
		price_from: 1009,
		price_to: 1500,
		image_url: "/assets/images/city/fergana.jpg",
		description:
			"Discover the heart of the Fergana Valley with its silk workshops and mountain landscapes.",
		duration: 2,
		rating: 5,
		reviews_count: 51,
		has_free_cancellation: true
	},
	{
		id: "popular-tour-2",
		title: "Samarkand Night Tour",
		price_from: 850,
		price_to: 1200,
		image_url: "/assets/images/city/samarkand.jpg",
		description:
			"Experience the magic of Samarkand's illuminated monuments under the starlit sky.",
		duration: 1,
		rating: 5,
		reviews_count: 38,
		has_free_cancellation: true
	},
	{
		id: "popular-tour-3",
		title: "Bukhara Bazaar Walk",
		price_from: 650,
		price_to: 900,
		image_url: "/assets/images/city/bukhara.jpg",
		description:
			"A guided walk through the ancient trading domes and vibrant spice markets of Bukhara.",
		duration: 1,
		rating: 4,
		reviews_count: 27,
		has_free_cancellation: true
	},
	{
		id: "popular-tour-4",
		title: "Khiva Sunrise Masterclass",
		price_from: 1200,
		price_to: 1800,
		image_url: "/assets/images/city/khiva.jpg",
		description:
			"Capture the first light on the minarets of Khiva followed by a traditional bread-making workshop.",
		duration: 2,
		rating: 5,
		reviews_count: 44,
		has_free_cancellation: false
	},
	{
		id: "popular-tour-5",
		title: "Tashkent Metro Art Tour",
		price_from: 400,
		price_to: 600,
		image_url: "/assets/images/city/tashkent.jpg",
		description:
			"Discover the stunning architecture and mosaic art of the world-famous Tashkent Metro stations.",
		duration: 1,
		rating: 4,
		reviews_count: 19,
		has_free_cancellation: true
	},
	{
		id: "popular-tour-6",
		title: "Silk Road Heritage Trail",
		price_from: 1500,
		price_to: 2200,
		image_url: "/assets/images/tours/silk-road.jpg",
		description:
			"Follow the ancient Silk Road through Uzbekistan's most iconic cities and caravanserais.",
		duration: 5,
		rating: 5,
		reviews_count: 62,
		has_free_cancellation: true
	}
];

export const SPECIAL_OFFERS_MOCK: ICatalogTourBackend[] = [
	{
		id: "special-tour-1",
		title: "Samarkand Express",
		price_from: 799,
		price_to: 1100,
		image_url: "/assets/images/city/samarkand.jpg",
		description:
			"A compact two-day journey through Samarkand's UNESCO sites.",
		duration: 2,
		rating: 5,
		reviews_count: 33,
		has_free_cancellation: true,
		is_recommended: true
	},
	{
		id: "special-tour-2",
		title: "Desert Stargazing",
		price_from: 599,
		price_to: 850,
		image_url: "/assets/images/experiences/nature-2.jpg",
		description:
			"Overnight desert camp with traditional music and stargazing.",
		duration: 1,
		rating: 4,
		reviews_count: 21,
		has_free_cancellation: true,
		is_recommended: true
	},
	{
		id: "special-tour-3",
		title: "Crafts of Rishtan",
		price_from: 450,
		price_to: 700,
		image_url: "/assets/images/experiences/craft.jpg",
		description:
			"Hands-on pottery workshop in the legendary ceramics town.",
		duration: 1,
		rating: 5,
		reviews_count: 15,
		has_free_cancellation: false,
		is_recommended: true
	}
];

const uniqueTours = (tours: ICatalogTourBackend[]) => {
	const seen = new Set<string>();

	return tours.filter((tour) => {
		if (seen.has(tour.id)) return false;
		seen.add(tour.id);
		return true;
	});
};

export const CATALOG_TOURS_MOCK: ICatalogTourBackend[] = uniqueTours([
	...POPULAR_TOURS_MOCK,
	...SPECIAL_OFFERS_MOCK
]);
