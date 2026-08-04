import type { TColumnRatio } from "@/shared/ui/blocks/types/block-render.types";

export const DEFAULT_COLUMN_RATIO: TColumnRatio = "2:1";

export const COLUMN_RATIO_CLASS: Record<TColumnRatio, string> = {
	"1:1": "md:grid-cols-[1fr_1fr]",
	"1:2": "md:grid-cols-[1fr_2fr]",
	"2:1": "md:grid-cols-[2fr_1fr]",
	"1:3": "md:grid-cols-[1fr_3fr]",
	"3:1": "md:grid-cols-[3fr_1fr]",
	"2:3": "md:grid-cols-[2fr_3fr]",
	"3:2": "md:grid-cols-[3fr_2fr]",
	"1:4": "md:grid-cols-[1fr_4fr]",
	"4:1": "md:grid-cols-[4fr_1fr]",
	"3:4": "md:grid-cols-[3fr_4fr]",
	"4:3": "md:grid-cols-[4fr_3fr]",
	"1:5": "md:grid-cols-[1fr_5fr]",
	"5:1": "md:grid-cols-[5fr_1fr]",
	"2:5": "md:grid-cols-[2fr_5fr]",
	"5:2": "md:grid-cols-[5fr_2fr]",
	"3:5": "md:grid-cols-[3fr_5fr]",
	"5:3": "md:grid-cols-[5fr_3fr]",
	"4:5": "md:grid-cols-[4fr_5fr]",
	"5:4": "md:grid-cols-[5fr_4fr]"
};
