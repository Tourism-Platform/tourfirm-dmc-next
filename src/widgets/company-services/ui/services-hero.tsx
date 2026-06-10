import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import { SERVICES_HERO_IMAGE } from "../model";

export async function ServicesHero() {
	const t = await getTranslations("company_services_page");

	return (
		<section className="relative min-h-[400px] sm:min-h-[480px]">
			<Image
				src={SERVICES_HERO_IMAGE}
				alt={t("hero.title")}
				fill
				priority
				className="object-cover object-[center_40%] brightness-[0.85] saturate-[1.2]"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-7xl flex-col justify-end gap-4 px-4 py-16 sm:min-h-[480px] sm:gap-6 sm:px-6 sm:py-20 lg:px-8">
				<div className="flex max-w-3xl flex-col gap-4 text-white">
					<p className="text-primary text-xs font-semibold uppercase tracking-widest">
						{t("hero.eyebrow")}
					</p>
					<h1 className="text-3xl font-semibold uppercase leading-tight sm:text-4xl lg:text-5xl">
						{t("hero.title")}{" "}
						<span className="text-primary italic normal-case">
							{t("hero.title_accent")}
						</span>
					</h1>
					<p className="text-base font-medium text-white/95 sm:text-lg">
						{t("hero.subtitle")}
					</p>
					<p className="text-sm text-white/90 sm:text-base">
						{t("hero.description")}
					</p>
					<div className="flex flex-wrap gap-3 pt-2">
						<Button asChild>
							<Link href={ENUM_PATH.HELP.CONTACT}>
								{t("hero.primary_cta")}
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
						>
							<a href="#directions">{t("hero.secondary_cta")}</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
