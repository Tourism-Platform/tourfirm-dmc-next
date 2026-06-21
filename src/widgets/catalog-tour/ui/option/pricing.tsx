"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC } from "react";

import type { IOptionDetail } from "@/entities/tour/catalog";

interface IPricingProps {
	optionData?: IOptionDetail;
}

export const Pricing: FC<IPricingProps> = ({ optionData }) => {
	const t = useTranslations("catalog_tour_option_page");

	return (
		<div className="flex flex-col w-full py-2">
			<h2 className="text-2xl font-bold mb-6">{t("pricing.title")}</h2>

			<div className="flex items-center justify-between mb-8">
				<span className="font-semibold text-base">
					{t("pricing.total_price")}
				</span>
				<div className="flex flex-col items-end gap-1">
					<div className="flex items-center gap-2">
						<Info className="w-4 h-4 text-muted-foreground" />
						<span className="font-bold text-base">
							{optionData?.price ?? "—"}
						</span>
					</div>
					<span className="text-sm text-muted-foreground">
						{t("pricing.est_cost")}
					</span>
				</div>
			</div>

			{/* <h3 className="text-xl font-bold mb-4">{t("pricing.details")}</h3> */}
			{/* <Separator className="mb-2" />

			<Accordion type="multiple" className="w-full">
				<AccordionItem value="accomodation" className="border-b">
					<AccordionTrigger className="hover:no-underline font-semibold text-base">
						{t("pricing.accomodation")}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2 pb-4" />
				</AccordionItem>

				<AccordionItem value="activity" className="border-b">
					<AccordionTrigger className="hover:no-underline font-semibold text-base">
						{t("pricing.activity")}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2 pb-4" />
				</AccordionItem>

				<AccordionItem value="transportation" className="border-b">
					<AccordionTrigger className="hover:no-underline font-semibold text-base">
						{t("pricing.transportation")}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2 pb-4" />
				</AccordionItem>

				<AccordionItem
					value="transfer"
					className="border-b border-b-transparent"
				>
					<AccordionTrigger className="hover:no-underline font-semibold text-base">
						{t("pricing.transfer")}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2 pb-4" />
				</AccordionItem>
			</Accordion> */}
		</div>
	);
};
