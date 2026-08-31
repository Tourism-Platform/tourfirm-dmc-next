import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { TourPreviewPage } from "@/page/tour-preview";

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export default async function TourRoute({ params }: TProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	return <TourPreviewPage slug={slug} />;
}
