import type { TDirectionI18n } from "./common.types";

export type TServicesDirectionId = "guides" | "programs" | "business";

export type TServicesDirectionConfig = {
	id: TServicesDirectionId;
	i18n: TDirectionI18n;
};

export const SERVICES_DIRECTIONS_I18N: Record<
	TServicesDirectionId,
	TDirectionI18n
> = {
	guides: {
		title: "directions.items.guides.title",
		description: "directions.items.guides.description",
		cta: "directions.items.guides.cta"
	},
	programs: {
		title: "directions.items.programs.title",
		description: "directions.items.programs.description",
		cta: "directions.items.programs.cta"
	},
	business: {
		title: "directions.items.business.title",
		description: "directions.items.business.description",
		cta: "directions.items.business.cta"
	}
};
