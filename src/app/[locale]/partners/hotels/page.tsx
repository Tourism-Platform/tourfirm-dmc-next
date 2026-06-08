import { setRequestLocale } from "next-intl/server";

import { PartnersHotelsPage } from "@/page/partners-hotels";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function HotelsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <PartnersHotelsPage />;
}
