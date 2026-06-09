import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale
} from "next-intl/server";
import { Exo_2, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { routing } from "@/shared/i18n";
import "@/shared/styles/globals.css";

import { FooterDefault, HeaderDefault } from "@/widgets/layouts/default";

import Providers from "../__providers";

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

	return {
		title: t("meta.title"),
		description: t("meta.description")
	};
}

export default async function LocaleLayout({ children, params }: TProps) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = await getMessages();

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
						<HeaderDefault />
						<div className="flex flex-1 flex-col mb-10 md:mb-20 lg:mb-32">
							{children}
						</div>
						<FooterDefault />
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
