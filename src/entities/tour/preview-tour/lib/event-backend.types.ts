export const ENUM_EVENT_BACKEND = {
	ACTIVITY: "activity",
	BUS: "bus",
	FLIGHT: "flight",
	GUIDE: "guide",
	HOUSING: "housing",
	REF: "ref",
	SUPPLEMENTARY: "supplementary",
	TRAIN: "train",
	TRANSFER: "transfer",
	OPTIONS: "options"
} as const;

export type TEventBackendType =
	(typeof ENUM_EVENT_BACKEND)[keyof typeof ENUM_EVENT_BACKEND];
