import type { TBlockRenderProps } from "@/shared/ui/blocks/types/block-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";

import type { TMainI18nKey } from "./common.types";

export type TMainPageTranslateFn = (key: TMainI18nKey) => string;

export type TMainPageSectionConfig = Omit<
	TBlockRenderProps,
	"cards" | "stops"
> & {
	cards?: (t: (key: string) => string) => TCardRenderProps[];
};

export type TMainPageConfig = {
	sections: TMainPageSectionConfig[];
};
