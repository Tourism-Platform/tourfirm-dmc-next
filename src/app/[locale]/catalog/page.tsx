import { setRequestLocale } from "next-intl/server";

import { ENUM_PATH, type TQueryParams } from "@/shared/config";

import { CatalogPage } from "@/page/catalog";

type TProps = {
	params: Promise<{ locale: string }>;
	searchParams: Promise<TQueryParams[typeof ENUM_PATH.MAIN.CATALOG]>;
};

export default async function CatalogRoute({ params, searchParams }: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	return <CatalogPage search={query} />;
}
