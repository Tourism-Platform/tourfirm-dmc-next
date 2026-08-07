import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { TourPreviewPage } from "@/page/tour-preview";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale; tourId: string }>;
};

export default async function TourRoute({ params }: TProps) {
	const { locale, tourId } = await params;
	setRequestLocale(locale);

	return <TourPreviewPage tourId={tourId} />;
}
