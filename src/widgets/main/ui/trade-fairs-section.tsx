import { getTranslations } from "next-intl/server";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { MAIN_TRADE_FAIRS_CONFIG } from "../model";

export async function TradeFairsSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("trade_fairs.eyebrow")}
				title={t("trade_fairs.title")}
				description={t("trade_fairs.description")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{MAIN_TRADE_FAIRS_CONFIG.map((item) => (
					<CardRender
						key={item.id}
						variant={CardVariant.TradeFair}
						item={{
							title: t(item.i18n.title),
							stand: t(item.i18n.stand),
							participants: t(item.i18n.participants),
							country: t(item.i18n.country)
						}}
					/>
				))}
			</div>
		</section>
	);
}
