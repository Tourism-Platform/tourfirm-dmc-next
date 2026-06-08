import { setRequestLocale } from "next-intl/server";

import { MainPage } from "@/page/main";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <MainPage />;
}
