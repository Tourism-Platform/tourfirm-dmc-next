import type { Media } from "@/payload-types";

export type TMediaValidationResult = {
	isBroken: boolean;
	reason?: string;
};

/**
 * Local record pre-check only. Storage object existence is verified
 * separately via S3 HeadObject in seed (existing media only).
 */
export function isMediaBroken(
	media: Pick<Media, "url" | "filename" | "sourcePath">
): TMediaValidationResult {
	const source = media.sourcePath ?? media.filename ?? "unknown";

	if (!media.url || media.url.trim().length === 0) {
		return {
			isBroken: true,
			reason: `missing url for ${source}`
		};
	}

	return {
		isBroken: false
	};
}
