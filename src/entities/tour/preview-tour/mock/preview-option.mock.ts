import { ENUM_PREVIEW_OPTION_EVENT } from "../types/preview-option-event.types";

const PREVIEW_IMAGE =
	"https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000";

export const PREVIEW_OPTION_MOCK_ID = "1f2b3d82-5c4d-4b9f-9f7a-1a42e71d1b11";

export const PREVIEW_TOUR_OPTIONS_LIST_MOCK = [
	{
		id: PREVIEW_OPTION_MOCK_ID,
		name: "Classic Silk Road",
		description:
			"A comprehensive tour of Samarkand, Bukhara, Khiva and Tashkent with local guides.",
		cover_image_path: PREVIEW_IMAGE,
		total_price: { val: 500, currency: "USD" },
		total_price_max: { val: 650, currency: "USD" }
	},
	{
		id: "2f2b3d82-5c4d-4b9f-9f7a-1a42e71d1b22",
		name: "Premium Experience",
		description:
			"Upgrade your journey with boutique hotels and private transfers.",
		cover_image_path: PREVIEW_IMAGE,
		total_price: { val: 999, currency: "USD" },
		total_price_max: { val: 1200, currency: "USD" }
	}
];

export const PREVIEW_OPTION_BACKEND_MOCK = {
	id: PREVIEW_OPTION_MOCK_ID,
	total_price: { val: 500, currency: "USD" },
	total_price_max: { val: 650, currency: "USD" },
	events: [
		{
			typ: "ref",
			name: "Arrival in Tashkent",
			description:
				"Upon arrival at the airport, guests will be met by a representative.",
			day: 1,
			position: 0
		},
		{
			typ: "ref",
			name: "Samarkand city tour",
			description: "Explore Registan Square and historic monuments.",
			day: 2,
			position: 0
		}
	]
};

export { ENUM_PREVIEW_OPTION_EVENT };
