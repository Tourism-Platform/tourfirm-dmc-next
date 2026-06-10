"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, withErrorBoundary } from "@/shared/ui";

import { ABOUT_HERO_IMAGE } from "../model";

const AboutCtaSectionBase: FC = () => {
	const t = useTranslations("company_about_page");

	return (
		<section className="overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-secondary to-muted">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
				<div className="flex flex-col gap-4 p-6 sm:p-10">
					<p className="text-primary text-xs font-semibold uppercase tracking-widest">
						{t("cta.eyebrow")}
					</p>
					<h2 className="text-2xl font-semibold sm:text-3xl">
						{t("cta.title")}
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("cta.description")}
					</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href={ENUM_PATH.MAIN.CATALOG}>
								{t("cta.primary")}
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href={ENUM_PATH.HELP.CONTACT}>
								{t("cta.secondary")}
							</Link>
						</Button>
					</div>
				</div>
				<div className="relative hidden min-h-56 lg:block">
					<Image
						src={ABOUT_HERO_IMAGE}
						alt=""
						fill
						className="object-cover"
						sizes="320px"
					/>
				</div>
			</div>
		</section>
	);
};

export const AboutCtaSection = withErrorBoundary(AboutCtaSectionBase);
