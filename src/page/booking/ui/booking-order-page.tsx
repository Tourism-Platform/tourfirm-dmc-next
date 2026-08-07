"use client";

import { useEffect } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useAppSelector } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";

import { useGetAuthAccountQuery } from "@/entities/auth";

import { OrderId } from "@/widgets/booking";

type TProps = {
	orderId: string;
};

export function BookingOrderPage({ orderId }: TProps) {
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
		<div className="flex flex-1 flex-col pt-10">
			<OrderId orderId={orderId} />
		</div>
	);
}
