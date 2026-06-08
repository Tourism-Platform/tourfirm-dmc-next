import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { type ControllerRenderProps, type FieldValues } from "react-hook-form";

import { cn } from "@/shared/lib";

import { MenuBar } from "./ui";

export interface ICustomEditorProps<
	T extends FieldValues
> extends React.HTMLAttributes<HTMLDivElement> {
	field: ControllerRenderProps<T>;
	defaultValue?: string;
}

export const CustomEditor = <T extends FieldValues>({
	field,
	defaultValue,
	className,
	...props
}: ICustomEditorProps<T>) => {
	const parseContent = (value: string) => {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	};

	const editor = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({ types: ["heading", "paragraph"] })
		],

		editorProps: {
			attributes: {
				class: "flex-1 overflow-auto min-h-[290px] p-4 rounded-t-lg [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 w-full   [&_h1]:text-4xl [&_h1]:font-bold  [&_h2]:text-3xl [&_h2]:font-semibold    [&_h3]:text-2xl [&_h3]:font-semibold  [&_h4]:text-xl [&_h4]:font-semibold"
			}
		},

		content: field?.value
			? parseContent(field.value)
			: `<p>${defaultValue || ""}</p>`,
		onUpdate: ({ editor }) => {
			const text = JSON.stringify(editor?.getJSON());
			field.onChange(text);
		},

		immediatelyRender: false
	});

	// Синхронизация контента при изменении значения в форме (например, после form.reset)
	useEffect(() => {
		if (!editor) return;

		const currentJson = JSON.stringify(editor.getJSON());
		if (field.value !== currentJson && field.value !== undefined) {
			editor.commands.setContent(parseContent(field.value));
		}
	}, [field.value, editor]);

	const isInvalid =
		props["aria-invalid"] === true || props["aria-invalid"] === "true";

	return (
		<div
			className={cn(
				"border-input dark:bg-input/30 flex h-full min-h-[340px] w-full flex-col overflow-hidden rounded-lg border transition-[color,box-shadow]",
				"focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
				isInvalid &&
					"border-destructive ring-destructive/20 dark:ring-destructive/40 ring-1",
				className
			)}
			{...props}
		>
			<div className="flex-1 overflow-auto">
				<EditorContent editor={editor} />
			</div>

			<MenuBar editor={editor} />
		</div>
	);
};
