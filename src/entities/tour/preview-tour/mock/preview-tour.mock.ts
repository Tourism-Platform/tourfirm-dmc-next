import { LanguageCode, PickupType } from "@/shared/api";

import type { TPreviewTourBackend } from "../types";

const PREVIEW_IMAGE =
	"https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000";

export const TOUR_PREVIEW_TOUR_MOCK: TPreviewTourBackend = {
	title: "Silk Road Discovery",
	overview: null,
	description:
		"Embark on an unforgettable journey through the ancient cities of Uzbekistan. Discover the rich history, stunning architecture, and warm hospitality of the Silk Road.",
	additional_information:
		"Please wear comfortable walking shoes. Some sites require modest dress.",
	pickup_description:
		"We provide pickup from all major hotels in Tashkent and the international airport.",
	cancellation_policy:
		"Full refund for cancellations made at least 7 days before the start date.",
	overview_description: null,
	languages: [LanguageCode.En, LanguageCode.Ru],
	amenities_included: ["wifi"],
	amenities_not_included: ["lunch"],
	pickup_type: [PickupType.AirportPickup],
	images: [
		{
			id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
			image_url: PREVIEW_IMAGE,
			is_primary: true
		},
		{
			id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
			image_url: PREVIEW_IMAGE,
			is_primary: false
		}
	]
};
