import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { CatalogTourBookingPage } from "@/page/catalog-tour-booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{
		locale: TypedLocale;
		tourId: string;
		bookingId: string;
	}>;
};

export default async function CatalogTourBookingDraftRoute({ params }: TProps) {
	const { locale, tourId, bookingId } = await params;
	setRequestLocale(locale);

	return <CatalogTourBookingPage tourId={tourId} bookingId={bookingId} />;
}
