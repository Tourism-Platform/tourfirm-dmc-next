import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Exo_2, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ENUM_PATH } from "@/shared/config";
import { routing } from "@/shared/i18n";
import { createPageMetadata } from "@/shared/lib/seo";
import "@/shared/styles/globals.css";
import { UiContentProvider } from "@/shared/ui-content";
import {
	getDropdownLanguages,
	getLocaleAvailability,
	isLocaleEnabled,
	loadUiContent
} from "@/shared/ui-content/server";

import { AuthBootstrap } from "@/features/auth";

import { FooterDefault, HeaderDefault } from "@/widgets/layouts/default";

import Providers from "../__providers";

import { loadLayoutNavigation } from "@/cms/lib/load-layout-navigation";

const exo2 = Exo_2({
	variable: "--font-exo-2",
	subsets: ["latin", "cyrillic"]
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500"]
});

const kurier = localFont({
	src: [
		{
			path: "../../shared/assets/fonts/kurier-italic.otf",
			weight: "400",
			style: "italic"
		}
	],
	variable: "--font-kurier",
	display: "swap"
});

type TProps = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

/**
 * Always read localeAvailability / nav from CMS.
 * Static build against an empty DB would otherwise bake permanent 404s.
 */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<TProps, "children">) {
	const { locale } = await params;
	const uiContent = await loadUiContent(locale);

	return createPageMetadata({
		title: uiContent.common.meta.title,
		description: uiContent.common.meta.description,
		locale,
		path: ENUM_PATH.MAIN.ROOT
	});
}

export default async function LocaleLayout({ children, params }: TProps) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const availability = await getLocaleAvailability();

	if (!isLocaleEnabled(locale, availability)) {
		notFound();
	}

	setRequestLocale(locale);

	const [uiContent, layoutNavigation] = await Promise.all([
		loadUiContent(locale),
		loadLayoutNavigation(locale)
	]);

	const dropdownLanguages = getDropdownLanguages(availability);

	return (
		<html
			lang={locale}
			className={`${exo2.variable} ${jetbrainsMono.variable} ${kurier.variable} h-full font-sans antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<Providers>
					<NextIntlClientProvider locale={locale} timeZone="UTC">
						<UiContentProvider value={uiContent}>
							<HeaderDefault
								navItems={layoutNavigation.navItems}
								destinationsNav={
									layoutNavigation.destinationsNav
								}
								routesNav={layoutNavigation.routesNav}
								experiencesNav={layoutNavigation.experiencesNav}
								informationNav={layoutNavigation.informationNav}
								logoSrc={layoutNavigation.logoSrc}
								dropdownLanguages={dropdownLanguages}
								brandName={uiContent.footer.brand.name}
								userMenuItems={layoutNavigation.userMenuItems}
							/>
							<AuthBootstrap />
							<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
								{children}
							</main>
							<FooterDefault
								columns={layoutNavigation.footerColumns}
								socialLinks={layoutNavigation.socialLinks}
								copyrightText={layoutNavigation.copyrightText}
								uiTexts={uiContent.footer}
							/>
						</UiContentProvider>
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
