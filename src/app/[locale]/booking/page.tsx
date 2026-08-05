import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib/seo";

import { BookingPage } from "@/page/booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;

	return createPageMetadata({
		title: "Booking",
		description: "Manage your bookings",
		locale,
		path: ENUM_PATH.MAIN.BOOKING
	});
}

export default async function BookingRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <BookingPage />;
}
