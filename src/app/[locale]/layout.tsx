import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale
} from "next-intl/server";
import { Exo_2, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ENUM_PATH } from "@/shared/config";
import { routing } from "@/shared/i18n";
import { createPageMetadata } from "@/shared/lib/seo";
import "@/shared/styles/globals.css";

import { FooterDefault, HeaderDefault } from "@/widgets/layouts/default";

import Providers from "../__providers";

import { loadLayoutNavigation } from "@/cms/lib/load-layout-navigation";

const exo2 = Exo_2({
	variable: "--font-exo-2",
	subsets: ["latin", "cyrillic"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

type TProps = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<TProps, "children">) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "footer" });

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
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
	const messages = await getMessages();
	const layoutNavigation = await loadLayoutNavigation(locale);

	return (
		<html
			lang={locale}
			className={`${exo2.variable} ${geistMono.variable} h-full font-sans antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<Providers>
					<NextIntlClientProvider
						messages={messages}
						locale={locale}
						timeZone="UTC"
					>
						<HeaderDefault
							navItems={layoutNavigation.navItems}
							destinationsNav={layoutNavigation.destinationsNav}
							logoSrc={layoutNavigation.logoSrc}
						/>
						<div className="flex flex-1 flex-col">{children}</div>
						<FooterDefault
							columns={layoutNavigation.footerColumns}
							socialLinks={layoutNavigation.socialLinks}
							copyrightText={layoutNavigation.copyrightText}
						/>
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
