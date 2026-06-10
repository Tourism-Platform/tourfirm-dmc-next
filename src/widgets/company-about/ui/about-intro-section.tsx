import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { ABOUT_HERO_IMAGE } from "../model";

import { AboutSectionHeader } from "./about-section-header";

export async function AboutIntroSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<div className="flex flex-col gap-4">
					<AboutSectionHeader
						eyebrow={t("intro.eyebrow")}
						title={t("intro.title")}
						description={t("intro.description")}
					/>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("intro.paragraph")}
					</p>
				</div>
				<div className="relative min-h-64 overflow-hidden rounded-2xl lg:min-h-80">
					<Image
						src={ABOUT_HERO_IMAGE}
						alt={t("intro.title")}
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>
		</section>
	);
}
