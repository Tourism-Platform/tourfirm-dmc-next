import type { TPubEventMediaFields } from "../types/catalog-preview-option-media.types";

export const CATALOG_PREVIEW_MOCK_IMAGE_URLS = {
	single1: "/assets/images/experiences/culture-1.jpg",
	single2: "/assets/images/experiences/culture-2.jpg",
	single3: "/assets/images/experiences/craft.jpg",
	single4: "/assets/images/experiences/food.jpg",
	single5: "/assets/images/experiences/nature-1.jpg",
	hotelA: "/assets/images/city/samarkand.jpg",
	hotelB: "/assets/images/city/bukhara.jpg",
	hotelC: "/assets/images/city/khiva.jpg",
	hotelD: "/assets/images/city/tashkent.jpg",
	hotelE: "/assets/images/city/fergana.jpg",
	activityA: "/assets/images/experiences/culture-1.jpg",
	activityB: "/assets/images/experiences/craft.jpg",
	activityC: "/assets/images/experiences/food.jpg",
	cover: "/assets/images/tours/silk-road.jpg"
} as const;

export type { TPubEventMediaFields };

export const withCatalogPreviewEventMedia = <T extends object>(
	event: T,
	imagePaths: string[]
): T & TPubEventMediaFields => ({
	...event,
	image_paths: imagePaths,
	primary_image_path: imagePaths[0] ?? null
});
