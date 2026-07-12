import { type TCardRenderProps } from "../types/card-render.types";

import { CARD_REGISTRY } from "./card-registry";

export function CardRender({ type: variant, item }: TCardRenderProps) {
	const render = CARD_REGISTRY[variant];

	if (!render) {
		return null;
	}

	return render(item);
}
