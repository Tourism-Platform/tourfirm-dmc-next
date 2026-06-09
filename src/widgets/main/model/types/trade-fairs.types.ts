import type { TMainI18nKey } from "./common.types";

export type TTradeFairId = "imex" | "itb_china" | "seoul";

export type TTradeFairI18n = {
	title: TMainI18nKey;
	stand: TMainI18nKey;
	participants: TMainI18nKey;
	country: TMainI18nKey;
};

export type TTradeFairConfig = {
	id: TTradeFairId;
	i18n: TTradeFairI18n;
};

export const MAIN_TRADE_FAIR_I18N: Record<TTradeFairId, TTradeFairI18n> = {
	imex: {
		title: "trade_fairs.items.imex.title",
		stand: "trade_fairs.items.imex.stand",
		participants: "trade_fairs.items.imex.participants",
		country: "trade_fairs.items.imex.country"
	},
	itb_china: {
		title: "trade_fairs.items.itb_china.title",
		stand: "trade_fairs.items.itb_china.stand",
		participants: "trade_fairs.items.itb_china.participants",
		country: "trade_fairs.items.itb_china.country"
	},
	seoul: {
		title: "trade_fairs.items.seoul.title",
		stand: "trade_fairs.items.seoul.stand",
		participants: "trade_fairs.items.seoul.participants",
		country: "trade_fairs.items.seoul.country"
	}
};
