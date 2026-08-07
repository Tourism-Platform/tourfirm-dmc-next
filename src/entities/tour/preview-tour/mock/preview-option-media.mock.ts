import type { TPubEventMediaFields } from "../types/preview-option-media.types";

/** Stable preview URLs (picsum) — used until pub API exposes image_paths. */
export const PREVIEW_MOCK_IMAGE_URLS = {
	single1: "https://picsum.photos/id/10/800/600",
	single2: "https://picsum.photos/id/11/800/600",
	single3: "https://picsum.photos/id/12/800/600",
	single4: "https://picsum.photos/id/13/800/600",
	single5: "https://picsum.photos/id/14/800/600",
	hotelA: "https://picsum.photos/id/15/800/600",
	hotelB: "https://picsum.photos/id/16/800/600",
	hotelC: "https://picsum.photos/id/17/800/600",
	hotelD: "https://picsum.photos/id/18/800/600",
	hotelE: "https://picsum.photos/id/19/800/600",
	activityA: "https://picsum.photos/id/20/800/600",
	activityB: "https://picsum.photos/id/21/800/600",
	activityC: "https://picsum.photos/id/22/800/600",
	cover: "https://picsum.photos/id/23/800/600"
} as const;

export type { TPubEventMediaFields };

export const withEventMedia = <T extends object>(
	event: T,
	imagePaths: string[]
): T & TPubEventMediaFields => ({
	...event,
	image_paths: imagePaths,
	primary_image_path: imagePaths[0] ?? null
});
