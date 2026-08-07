import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { CatalogTourBookingPage } from "@/page/catalog-tour-booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale; tourId: string }>;
};

export default async function CatalogTourBookingRoute({ params }: TProps) {
	const { locale, tourId } = await params;
	setRequestLocale(locale);

	return <CatalogTourBookingPage tourId={tourId} />;
}
