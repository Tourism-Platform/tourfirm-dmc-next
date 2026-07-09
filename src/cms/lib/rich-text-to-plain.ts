import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

export function richTextToPlain(value: unknown): string {
	if (!value) {
		return "";
	}

	if (typeof value === "string") {
		return value;
	}

	return convertLexicalToPlaintext({
		data: value as Parameters<typeof convertLexicalToPlaintext>[0]["data"]
	});
}
