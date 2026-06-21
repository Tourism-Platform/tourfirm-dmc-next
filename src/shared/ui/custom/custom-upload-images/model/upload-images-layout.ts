import type { CSSProperties } from "react";

export type TUploadImagesLayout = {
	style: CSSProperties;
	areas: string[];
};

export const UPLOAD_IMAGES_LAYOUTS: Record<number, TUploadImagesLayout> = {
	1: {
		style: {
			gridTemplateColumns: "1fr",
			gridTemplateRows: "1fr",
			gridTemplateAreas: `"a"`
		},
		areas: ["a"]
	},
	2: {
		style: {
			gridTemplateColumns: "57fr 43fr",
			gridTemplateRows: "1fr",
			gridTemplateAreas: `"a b"`
		},
		areas: ["a", "b"]
	},
	3: {
		style: {
			gridTemplateColumns: "57fr 43fr",
			gridTemplateRows: "1fr 1fr",
			gridTemplateAreas: `
        "a b"
        "a c"
      `
		},
		areas: ["a", "b", "c"]
	},
	4: {
		style: {
			gridTemplateColumns: "57fr 21.5fr 21.5fr",
			gridTemplateRows: "1fr 1fr",
			gridTemplateAreas: `
        "a b c"
        "a d d"
      `
		},
		areas: ["a", "b", "c", "d"]
	},
	5: {
		style: {
			gridTemplateColumns: "57fr 21.5fr 21.5fr",
			gridTemplateRows: "1fr 1fr",
			gridTemplateAreas: `
        "a b c"
        "a d e"
      `
		},
		areas: ["a", "b", "c", "d", "e"]
	}
};

const MAX_FEATURED_COUNT = 5;

export const getUploadImagesLayout = (
	count: number
): TUploadImagesLayout | undefined =>
	UPLOAD_IMAGES_LAYOUTS[Math.min(Math.max(count, 1), MAX_FEATURED_COUNT)];

export const UPLOAD_IMAGES_GRID_HEIGHT = 400;
