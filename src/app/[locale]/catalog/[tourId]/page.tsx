import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { CatalogTourPreviewPage } from "@/page/catalog-tour-preview";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale; tourId: string }>;
};

export default async function CatalogTourRoute({ params }: TProps) {
	const { locale, tourId } = await params;
	setRequestLocale(locale);

	return <CatalogTourPreviewPage tourId={tourId} />;
}
