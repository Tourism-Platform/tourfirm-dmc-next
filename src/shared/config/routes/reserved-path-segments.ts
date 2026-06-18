export const RESERVED_PATH_SEGMENTS = [
	"catalog",
	"company",
	"partners",
	"legal",
	"help",
	"admin",
	"api",
	"routes",
	"experiences",
	"themes",
	"journal",
	"trade-fairs"
] as const;

export type TReservedPathSegment = (typeof RESERVED_PATH_SEGMENTS)[number];

const RESERVED_SET = new Set<string>(RESERVED_PATH_SEGMENTS);

export function isReservedPathSegment(
	value: string
): value is TReservedPathSegment {
	return RESERVED_SET.has(value);
}
