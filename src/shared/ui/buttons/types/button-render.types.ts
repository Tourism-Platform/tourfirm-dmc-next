import type { TButtonVariantsProps } from "../../shadcn-ui/button";

export enum ActionType {
	mailto = "mailto",
	link = "link"
}

export interface IButtonItem {
	href?: string;
	email?: string;
	title: string;
	variant?: TButtonVariantsProps["variant"];
}

export type TButtonRenderProps = {
	type: ActionType;
	item: IButtonItem;
};
