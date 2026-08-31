import type { ReactNode } from "react";

import type { TBlockTone } from "@/shared/ui/blocks/types/block-render.types";

import { getBlockToneClass } from "../lib/block-tone";

type TToneBandProps = {
	tone?: TBlockTone;
	children: ReactNode;
};

export function ToneBand({ tone, children }: TToneBandProps) {
	const toneClass = getBlockToneClass(tone);

	if (!toneClass) {
		return children;
	}

	return (
		<div className={toneClass}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{children}
			</div>
		</div>
	);
}
