import { type Editor } from "@tiptap/react";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	ListIcon,
	ListOrdered,
	Strikethrough
} from "lucide-react";

import { type IEditorStarterItem } from "./types";

export const EDITOR_STARTER_ITEMS_LIST = (
	editor: Editor
): IEditorStarterItem[] => [
	{
		name: "bold",
		description: "Bold",
		icon: Bold,
		pressed: editor.isActive("bold"),
		onPressedChange: () => editor.chain().focus().toggleBold().run()
	},
	{
		name: "italic",
		description: "Italic",
		icon: Italic,
		pressed: editor.isActive("italic"),
		onPressedChange: () => editor.chain().focus().toggleItalic().run()
	},
	{
		name: "heading",
		description: "Heading 1",
		icon: Heading1,
		pressed: editor.isActive("heading", { level: 1 }),
		onPressedChange: () =>
			editor.chain().focus().toggleHeading({ level: 1 }).run()
	},
	{
		name: "heading",
		description: "Heading 2",
		icon: Heading2,
		pressed: editor.isActive("heading", { level: 2 }),
		onPressedChange: () =>
			editor.chain().focus().toggleHeading({ level: 2 }).run()
	},
	{
		name: "heading",
		description: "Heading 3",
		icon: Heading3,
		pressed: editor.isActive("heading", { level: 3 }),
		onPressedChange: () =>
			editor.chain().focus().toggleHeading({ level: 3 }).run()
	},
	{
		name: "strike",
		description: "Strike",
		icon: Strikethrough,
		pressed: editor.isActive("strike"),
		onPressedChange: () => editor.chain().focus().toggleStrike().run()
	},
	{
		name: "bulletList",
		description: "Bullet List",
		icon: ListIcon,
		pressed: editor.isActive("bulletList"),
		onPressedChange: () => editor.chain().focus().toggleBulletList().run()
	},
	{
		name: "orderedList",
		description: "Ordered List",
		icon: ListOrdered,
		pressed: editor.isActive("orderedList"),
		onPressedChange: () => editor.chain().focus().toggleOrderedList().run()
	}
	// {
	// 	name: "code",
	// 	description: "Code",
	// 	icon: Code,
	// 	pressed: editor.isActive("code"),
	// 	onPressedChange: () => editor.chain().focus().toggleCode().run()
	// }
];

export const EDITOR_TEXT_ALIGN_ITEMS_LIST = (
	editor: Editor
): IEditorStarterItem[] => [
	{
		textAlign: "left",
		description: "Left",
		icon: AlignLeft,
		pressed: editor.isActive({ textAlign: "left" }),
		onPressedChange: () => editor.chain().focus().setTextAlign("left").run()
	},
	{
		textAlign: "center",
		description: "Center",
		icon: AlignCenter,
		pressed: editor.isActive({ textAlign: "center" }),
		onPressedChange: () =>
			editor.chain().focus().setTextAlign("center").run()
	},
	{
		textAlign: "right",
		description: "Right",
		icon: AlignRight,
		pressed: editor.isActive({ textAlign: "right" }),
		onPressedChange: () =>
			editor.chain().focus().setTextAlign("right").run()
	}
];
