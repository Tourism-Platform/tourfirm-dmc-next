import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { ENUM_PATH } from "@/shared/config";
import { ButtonLink } from "@/shared/ui";

import { SERVICES_HERO_IMAGE } from "../model";

export async function ServicesCtaSection() {
	const t = await getTranslations("company_services_page");

	return (
		<section className="overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-secondary to-muted">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
				<div className="flex flex-col gap-4 p-6 sm:p-10">
					<p className="text-primary text-xs font-semibold uppercase tracking-widest">
						{t("cta.eyebrow")}
					</p>
					<h2 className="text-2xl font-semibold sm:text-3xl">
						{t("cta.title")}{" "}
						<span className="text-primary italic">
							{t("cta.title_accent")}
						</span>{" "}
						{t("cta.title_suffix")}
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("cta.description")}
					</p>
					<div className="flex flex-wrap gap-3">
						<ButtonLink href={ENUM_PATH.HELP.CONTACT}>
							{t("cta.primary")}
						</ButtonLink>
						<ButtonLink
							href={ENUM_PATH.MAIN.CATALOG}
							variant="outline"
						>
							{t("cta.secondary")}
						</ButtonLink>
					</div>
				</div>
				<div className="relative hidden min-h-56 lg:block">
					<Image
						src={SERVICES_HERO_IMAGE}
						alt=""
						fill
						className="object-cover"
						sizes="320px"
					/>
				</div>
			</div>
		</section>
	);
}
