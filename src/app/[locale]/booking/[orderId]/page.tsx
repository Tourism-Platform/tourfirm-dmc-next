import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib/seo";

import { BookingOrderPage } from "@/page/booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale; orderId: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, orderId } = await params;

	return createPageMetadata({
		title: `Booking ${orderId}`,
		description: "Booking order details",
		locale,
		path: buildRoute(ENUM_PATH.BOOKING.ORDER, { orderId })
	});
}

export default async function BookingOrderRoute({ params }: TProps) {
	const { locale, orderId } = await params;
	setRequestLocale(locale);

	return <BookingOrderPage orderId={orderId} />;
}
