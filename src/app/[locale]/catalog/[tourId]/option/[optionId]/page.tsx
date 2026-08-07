import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { CatalogTourOptionPreviewPage } from "@/page/catalog-tour-preview";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{
		locale: TypedLocale;
		tourId: string;
		optionId: string;
	}>;
};

export default async function CatalogTourOptionRoute({ params }: TProps) {
	const { locale, tourId, optionId } = await params;
	setRequestLocale(locale);

	return <CatalogTourOptionPreviewPage tourId={tourId} optionId={optionId} />;
}
