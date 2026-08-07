"use client";

import type { FC } from "react";

import {
	BlockRender,
	BlockType,
	type TBlockRenderProps
} from "@/shared/ui/blocks";

import { MostPopularTours } from "./most-popular-tours";
import { SpecialOffers } from "./special-offers";

type TProps = {
	sections: TBlockRenderProps[];
};

export const CatalogBlocks: FC<TProps> = ({ sections }) => {
	return (
		<>
			{sections.map((section, index) => {
				if (section.blockType === BlockType.mostPopularTours) {
					return (
						<MostPopularTours
							key={`popular-${index}`}
							eyebrow={section.eyebrow}
							title={section.title ?? ""}
							description={section.description}
						/>
					);
				}

				if (section.blockType === BlockType.specialOffers) {
					return (
						<SpecialOffers
							key={`offers-${index}`}
							eyebrow={section.eyebrow}
							title={section.title ?? ""}
							description={section.description}
							actions={section.actions}
						/>
					);
				}

				return (
					<BlockRender key={section.title ?? index} {...section} />
				);
			})}
		</>
	);
};
