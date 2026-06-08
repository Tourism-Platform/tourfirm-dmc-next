import { setRequestLocale } from "next-intl/server";

import { CatalogPage } from "@/page/catalog";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function CatalogRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CatalogPage />;
}
