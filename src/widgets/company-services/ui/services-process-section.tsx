import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { SERVICES_PROCESS_CONFIG } from "../model";
import { HOW_WORK_BEGIN_IMAGE } from "../model";

export async function ServicesProcessSection() {
	const t = await getTranslations("company_services_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("process.eyebrow")}
				title={t("process.title")}
				description={t("process.description")}
			/>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-stretch lg:gap-8">
				<div className="relative min-h-48 overflow-hidden rounded-2xl lg:h-full lg:min-h-0">
					<Image
						src={HOW_WORK_BEGIN_IMAGE}
						alt={t("process.title")}
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 55vw"
					/>
				</div>
				<div className="flex flex-col gap-3">
					{SERVICES_PROCESS_CONFIG.map((item, index) => (
						<CardRender
							key={item.id}
							variant={CardVariant.ServicesProcess}
							item={{
								step: String(index + 1),
								title: t(item.i18n.title),
								description: t(item.i18n.description)
							}}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
