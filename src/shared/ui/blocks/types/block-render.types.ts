import type { ReactNode } from "react";

import type { TButtonRenderProps } from "@/shared/ui/buttons/types/button-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";

export enum BlockType {
	hero = "hero",
	overviewStats = "overviewStats",
	regular = "regular",
	cta = "cta"
}

export type TBlockRenderProps = {
	blockType: BlockType;
	eyebrow?: string;
	title?: string;
	note?: string;
	description?: string;
	gridClassName?: string;
	imageSrc?: string;
	imageAlt?: string;
	children?: ReactNode;
	actions?: TButtonRenderProps[];
	cards?: TCardRenderProps[];
};
