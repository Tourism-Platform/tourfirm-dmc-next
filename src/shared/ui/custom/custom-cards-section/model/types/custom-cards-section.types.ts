import type { ReactNode } from "react";

import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";

export type TCardsSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	cards: TCardRenderProps[];
	gridClassName?: string;
	actions?: ReactNode;
};
