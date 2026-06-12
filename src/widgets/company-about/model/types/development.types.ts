import type { TCompanyAboutI18nKey } from "./common.types";

export type TAboutDevelopmentPhaseId = "phase_1" | "phase_2" | "phase_3";

export type TAboutDevelopmentPhaseConfig = {
	id: TAboutDevelopmentPhaseId;
	i18n: {
		label: TCompanyAboutI18nKey;
		description: TCompanyAboutI18nKey;
	};
};

export const ABOUT_DEVELOPMENT_PHASE_I18N: Record<
	TAboutDevelopmentPhaseId,
	TAboutDevelopmentPhaseConfig["i18n"]
> = {
	phase_1: {
		label: "development.phases.phase_1.label",
		description: "development.phases.phase_1.description"
	},
	phase_2: {
		label: "development.phases.phase_2.label",
		description: "development.phases.phase_2.description"
	},
	phase_3: {
		label: "development.phases.phase_3.label",
		description: "development.phases.phase_3.description"
	}
};
