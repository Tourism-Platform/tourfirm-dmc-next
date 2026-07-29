import type { Where } from "payload";

export type TNavSurface = "header" | "footer";

const PUBLISHED: Where = {
	_status: {
		equals: "published"
	}
};

export function buildNavVisibilityWhere(surface: TNavSurface): Where {
	const field =
		surface === "header" ? "status.showInHeader" : "status.showInFooter";

	return {
		and: [
			PUBLISHED,
			{
				or: [
					{ [field]: { equals: true } },
					{ [field]: { exists: false } }
				]
			}
		]
	};
}

export const PUBLISHED_AND_SHOW_IN_HEADER = buildNavVisibilityWhere("header");
