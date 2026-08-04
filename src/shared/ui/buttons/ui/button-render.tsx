import { LeadRequestButton } from "@/shared/ui/lead-request";

import {
	ActionType,
	type TButtonRenderProps
} from "../types/button-render.types";

import { ButtonLink } from "./button-link";
import { ButtonMailto } from "./button-mailto";

export function ButtonRender({ type: variant, item }: TButtonRenderProps) {
	switch (variant) {
		case ActionType.mailto:
			return (
				<ButtonMailto
					email={item.email ?? ""}
					title={item.title}
					variant={item.variant}
				/>
			);
		case ActionType.link:
			return (
				<ButtonLink
					href={item.href ?? ""}
					title={item.title}
					variant={item.variant}
				/>
			);
		case ActionType.form:
			return (
				<LeadRequestButton title={item.title} variant={item.variant} />
			);
	}
}
