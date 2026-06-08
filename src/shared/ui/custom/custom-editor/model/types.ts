import { type LucideIcon } from "lucide-react";

export interface IEditorStarterItem {
	name?: string;
	textAlign?: "left" | "center" | "right";
	description: string;
	icon: LucideIcon;
	pressed: boolean;
	onPressedChange: () => void;
}
