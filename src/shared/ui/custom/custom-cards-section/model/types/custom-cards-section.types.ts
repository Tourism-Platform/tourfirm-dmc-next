import type { ReactNode } from "react";

import type { TContentRow } from "@/shared/ui/blocks/types/block-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";

export type TCardsSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	cards: TCardRenderProps[];
	rows?: TContentRow[];
	gridClassName?: string;
	actions?: ReactNode;
	emptyLabel?: string;
};
