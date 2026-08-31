import type { TBlockTone } from "../types/block-render.types";

export const BLOCK_TONE_CLASS: Record<TBlockTone, string> = {
	default: "",
	tint: "bg-accent",
	warm: "bg-muted"
};

export function getBlockToneClass(tone?: TBlockTone): string {
	if (!tone || tone === "default") {
		return "";
	}

	return `full-bleed py-12 sm:py-16 ${BLOCK_TONE_CLASS[tone]}`;
}
