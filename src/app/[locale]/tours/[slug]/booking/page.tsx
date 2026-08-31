import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { TourBookingPage } from "@/page/tour-booking";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export default async function TourBookingRoute({ params }: TProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	return <TourBookingPage slug={slug} />;
}
