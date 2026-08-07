"use client";

import { useEffect } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useAppSelector } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";

import { useGetAuthAccountQuery } from "@/entities/auth";

import { TourBooking } from "@/widgets/tour-booking";

type TTourBookingPageProps = {
	tourId: string;
	bookingId?: string;
};

export function TourBookingPage({ tourId, bookingId }: TTourBookingPageProps) {
	const router = useRouter();
	const isAuth = useAppSelector((state) => state.userSlice.isAuth);
	const { isError, isLoading, isSuccess } = useGetAuthAccountQuery(
		undefined,
		{ skip: !isAuth }
	);

	useEffect(() => {
		if (!isAuth || isError) {
			router.replace(ENUM_PATH.AUTH.LOGIN);
		}
	}, [isAuth, isError, router]);

	if (!isAuth || isLoading || !isSuccess) {
		return null;
	}

	return <TourBooking tourId={tourId} bookingId={bookingId} />;
}
