import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { MainPage } from "@/page/main";

import { getHomepage } from "@/cms/api";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const revalidate = 60;
type TProps = {
	params: Promise<{
		locale: TypedLocale;
	}>;
};
export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const homepage = await getHomepage(locale);
	return createCmsPageMetadata({
		seo: homepage?.seo ?? {},
		locale,
		path: ENUM_PATH.MAIN.ROOT
	});
}
export default async function MainRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const homepage = await getHomepage(locale);
	const blocks = resolveBlockData(homepage?.blocks ?? [], {
		document: {},
		locale
	});
	const sections = await mapCmsBlocks(blocks);
	return <MainPage sections={sections} />;
}
