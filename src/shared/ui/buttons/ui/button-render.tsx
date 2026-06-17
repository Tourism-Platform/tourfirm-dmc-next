import { ActionType, type TButtonRenderProps } from "../types/button-render.types";

import { LinkButton } from "./link-button";
import { MailtoButton } from "./mailto-button";

export function ButtonRender({ type: variant, item }: TButtonRenderProps) {
	switch (variant) {
		case ActionType.mailto:
			return (
				<MailtoButton
					email={item.email ?? ""}
					title={item.title}
					variant={item.variant}
				/>
			);
		case ActionType.link:
			return (
				<LinkButton
					href={item.href ?? ""}
					title={item.title}
					variant={item.variant}
				/>
			);
	}
}
