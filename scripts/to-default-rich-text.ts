export function toDefaultRichText(text: string) {
	return {
		root: {
			type: "root",
			children: [
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							text,
							version: 1
						}
					],
					direction: "ltr",
					format: "",
					indent: 0,
					version: 1
				}
			],
			direction: "ltr",
			format: "",
			indent: 0,
			version: 1
		}
	};
}

function isRichTextValue(value: unknown): value is { root: unknown } {
	return Boolean(value && typeof value === "object" && "root" in value);
}

function normalizeDescriptionField(value: unknown): unknown {
	if (typeof value === "string") {
		return toDefaultRichText(value);
	}

	if (isRichTextValue(value)) {
		return value;
	}

	return value;
}

export function normalizeRichTextDescriptions(blocks: unknown[]): unknown[] {
	return blocks.map((block) => {
		if (!block || typeof block !== "object") {
			return block;
		}

		const entry = { ...(block as Record<string, unknown>) };

		if ("description" in entry) {
			entry.description = normalizeDescriptionField(entry.description);
		}

		if (Array.isArray(entry.cards)) {
			entry.cards = entry.cards.map((card) => {
				if (!card || typeof card !== "object") {
					return card;
				}

				const cardEntry = { ...(card as Record<string, unknown>) };

				if ("description" in cardEntry) {
					cardEntry.description = normalizeDescriptionField(
						cardEntry.description
					);
				}

				return cardEntry;
			});
		}

		if (Array.isArray(entry.questions)) {
			entry.questions = entry.questions.map((question) => {
				if (!question || typeof question !== "object") {
					return question;
				}

				const questionEntry = { ...(question as Record<string, unknown>) };

				if ("description" in questionEntry) {
					questionEntry.description = normalizeDescriptionField(
						questionEntry.description
					);
				}

				return questionEntry;
			});
		}

		return entry;
	});
}
