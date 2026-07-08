export const PAGE_PATH_GROUPS = [{ label: "Team", value: "team" }] as const;

export type TPagePathGroup = (typeof PAGE_PATH_GROUPS)[number]["value"];

const PAGE_PATH_GROUP_VALUES = new Set<string>(
	PAGE_PATH_GROUPS.map((option) => option.value)
);

export function isPagePathGroup(value: unknown): value is TPagePathGroup {
	return typeof value === "string" && PAGE_PATH_GROUP_VALUES.has(value);
}
