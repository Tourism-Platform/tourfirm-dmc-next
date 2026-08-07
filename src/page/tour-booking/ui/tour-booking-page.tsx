"use client";

import { useRequireAuth } from "@/features/auth";

import { TourBooking } from "@/widgets/tour-booking";

type TTourBookingPageProps = {
	tourId: string;
	bookingId?: string;
};

export function TourBookingPage({ tourId, bookingId }: TTourBookingPageProps) {
	const { isReady, isChecking } = useRequireAuth();

	if (isChecking || !isReady) {
		return null;
	}

	return <TourBooking tourId={tourId} bookingId={bookingId} />;
}
