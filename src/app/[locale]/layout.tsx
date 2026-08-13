import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Exo_2, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";

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

import { AuthBootstrap, GoogleCallbackRedirector } from "@/features/auth";

import {
	FooterDefault,
	HeaderDefault,
	LocaleShell
} from "@/widgets/layouts/default";

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
	params: Promise<{
		locale: string;
	}>;
};
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
	setRequestLocale(locale);

	const [availability, uiContent, layoutNavigation] = await Promise.all([
		getLocaleAvailability(),
		loadUiContent(locale),
		loadLayoutNavigation(locale)
	]);
	if (!isLocaleEnabled(locale, availability)) {
		notFound();
	}
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
							<Suspense fallback={null}>
								<AuthBootstrap />
								<GoogleCallbackRedirector />
							</Suspense>
							<LocaleShell
								header={
									<HeaderDefault
										navItems={layoutNavigation.navItems}
										destinationsNav={
											layoutNavigation.destinationsNav
										}
										routesNav={layoutNavigation.routesNav}
										experiencesNav={
											layoutNavigation.experiencesNav
										}
										informationNav={
											layoutNavigation.informationNav
										}
										logoSrc={layoutNavigation.logoSrc}
										dropdownLanguages={dropdownLanguages}
										brandName={uiContent.footer.brand.name}
										userMenuItems={
											layoutNavigation.userMenuItems
										}
									/>
								}
								footer={
									<FooterDefault
										columns={layoutNavigation.footerColumns}
										socialLinks={
											layoutNavigation.socialLinks
										}
										copyrightText={
											layoutNavigation.copyrightText
										}
										uiTexts={uiContent.footer}
									/>
								}
							>
								{children}
							</LocaleShell>
						</UiContentProvider>
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
