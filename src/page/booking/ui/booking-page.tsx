"use client";

import { useEffect } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useAppSelector } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";

import { useGetAuthAccountQuery } from "@/entities/auth";

export function BookingPage() {
	const router = useRouter();
	const isAuth = useAppSelector((state) => state.userSlice.isAuth);
	const { isError, isLoading, isSuccess } = useGetAuthAccountQuery(
		undefined,
		{
			skip: !isAuth
		}
	);

	useEffect(() => {
		if (!isAuth || isError) {
			router.replace(ENUM_PATH.AUTH.LOGIN);
		}
	}, [isAuth, isError, router]);

	if (!isAuth || isLoading || !isSuccess) {
		return null;
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 lg:px-8">
			<h1 className="text-3xl font-semibold">Booking</h1>
			<p className="text-muted-foreground mt-2">
				Your bookings will appear here.
			</p>
		</div>
	);
}
