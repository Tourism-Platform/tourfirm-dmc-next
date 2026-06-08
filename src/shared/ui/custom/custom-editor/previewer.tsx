import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";
import { type FC, useMemo } from "react";

import { cn } from "@/shared/lib";

const extensions = [
	StarterKit,
	TextAlign.configure({
		types: ["heading", "paragraph", "bulletList", "orderedList"]
	})
];

interface IPreviewerProps {
	text?: string | null;
	className?: string;
}

const parseTipTapHtml = (value: string) => {
	try {
		return generateHTML(JSON.parse(value), extensions);
	} catch {
		return generateHTML(
			JSON.parse('{ type: "doc", content: [] }'),
			extensions
		);
	}
};

export const Previewer: FC<IPreviewerProps> = ({ text, className }) => {
	const outPut = useMemo(() => {
		if (!text?.trim()) return null;
		return parseTipTapHtml(text);
	}, [text]);

	if (!outPut) return null;

	return (
		<div
			className={cn(
				"prose dark:prose-invert [&_h1]:text-4xl",
				"[&_h1]:font-bold",
				"[&_h2]:text-3xl",
				"[&_h2]:font-semibold",
				"[&_h3]:text-2xl",
				"[&_h3]:font-semibold",
				"[&_h4]:text-xl",
				"[&_h4]:font-semibold",
				"[&_ul]:list-disc",
				"[&_ul]:ml-4",
				"[&_ol]:list-decimal",
				"[&_ol]:ml-4",
				"prose-li:marker:text-primary",
				className
			)}
		>
			{parse(outPut)}
		</div>
	);
};
