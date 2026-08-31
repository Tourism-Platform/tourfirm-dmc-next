"use client";

import { useRequireAuth } from "@/features/auth";

import { TourBooking } from "@/widgets/tour-booking";

type TTourBookingPageProps = {
	slug: string;
	bookingId?: string;
};

export function TourBookingPage({ slug, bookingId }: TTourBookingPageProps) {
	const { isReady, isChecking } = useRequireAuth();

	if (isChecking || !isReady) {
		return null;
	}

	return <TourBooking slug={slug} bookingId={bookingId} />;
}
