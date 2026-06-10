import type { TProcessI18n } from "./common.types";

export type TServicesProcessId = "request" | "check" | "outline";

export type TServicesProcessConfig = {
	id: TServicesProcessId;
	i18n: TProcessI18n;
};

export const SERVICES_PROCESS_I18N: Record<TServicesProcessId, TProcessI18n> = {
	request: {
		step: "process.items.request.step",
		title: "process.items.request.title",
		description: "process.items.request.description"
	},
	check: {
		step: "process.items.check.step",
		title: "process.items.check.title",
		description: "process.items.check.description"
	},
	outline: {
		step: "process.items.outline.step",
		title: "process.items.outline.title",
		description: "process.items.outline.description"
	}
};
