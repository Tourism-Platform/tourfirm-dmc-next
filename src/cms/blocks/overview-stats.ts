import type { Block } from "payload";

import { cardFields } from "./card";

export const OverviewStats: Block = {
	slug: "overviewStats",
	fields: [
		{
			name: "cards",
			type: "array",
			fields: cardFields,
			// ARCH: reuse Card group; only overviewStat type is allowed here
			validate: (value) => {
				if (!Array.isArray(value)) {
					return true;
				}

				const invalid = value.some(
					(card) =>
						card &&
						typeof card === "object" &&
						"type" in card &&
						card.type !== "overviewStat"
				);

				if (invalid) {
					return "Only overviewStat cards are allowed in overviewStats block";
				}

				return true;
			}
		}
	]
};
