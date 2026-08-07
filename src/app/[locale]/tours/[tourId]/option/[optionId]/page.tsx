import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { TourOptionPreviewPage } from "@/page/tour-preview";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{
		locale: TypedLocale;
		tourId: string;
		optionId: string;
	}>;
};

export default async function TourOptionRoute({ params }: TProps) {
	const { locale, tourId, optionId } = await params;
	setRequestLocale(locale);

	return <TourOptionPreviewPage tourId={tourId} optionId={optionId} />;
}
