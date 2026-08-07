import type { JSONContent } from "@tiptap/core";

import { tryParseTipTapDoc } from "./parse-tiptap-doc";

const nodeToPlainText = (node: JSONContent): string => {
	if (node.type === "text" && node.text) return node.text;
	if (!node.content?.length) return "";
	return node.content.map(nodeToPlainText).filter(Boolean).join(" ");
};

const docToPlainText = (doc: JSONContent): string =>
	(doc.content ?? [])
		.map(nodeToPlainText)
		.filter(Boolean)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

export const tiptapToPlainText = (value?: string | null): string | null => {
	const trimmed = value?.trim();
	if (!trimmed) return null;

	const doc = tryParseTipTapDoc(trimmed);
	const plain = doc
		? docToPlainText(doc)
		: trimmed.replace(/\s+/g, " ").trim();

	return plain || null;
};
