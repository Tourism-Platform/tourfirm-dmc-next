import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { TourBookingPage } from "@/page/tour-booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{
		locale: TypedLocale;
		tourId: string;
		bookingId: string;
	}>;
};

export default async function TourBookingDraftRoute({ params }: TProps) {
	const { locale, tourId, bookingId } = await params;
	setRequestLocale(locale);

	return <TourBookingPage tourId={tourId} bookingId={bookingId} />;
}
