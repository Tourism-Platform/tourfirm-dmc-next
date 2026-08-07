import type { JSONContent } from "@tiptap/core";

export const plainTextToTipTapDoc = (value: string): JSONContent => ({
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: value.trim() ? [{ type: "text", text: value }] : []
		}
	]
});

/** Returns TipTap doc JSON when value is a valid doc string; otherwise null. */
export const tryParseTipTapDoc = (value: string): JSONContent | null => {
	try {
		const parsed = JSON.parse(value) as JSONContent;
		return parsed?.type === "doc" ? parsed : null;
	} catch {
		return null;
	}
};

/** TipTap doc if valid JSON, otherwise wraps plain/invalid input as a paragraph doc. */
export const resolveTipTapDoc = (value: string): JSONContent =>
	tryParseTipTapDoc(value) ?? plainTextToTipTapDoc(value);
