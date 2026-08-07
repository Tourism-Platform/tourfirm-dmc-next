"use client";

import { useRequireAuth } from "@/features/auth";

import { OrderId } from "@/widgets/booking";

type TProps = {
	orderId: string;
};

export function BookingOrderPage({ orderId }: TProps) {
	const { isReady, isChecking } = useRequireAuth();

	if (isChecking || !isReady) {
		return null;
	}

	return (
		<div className="flex flex-1 flex-col pt-10">
			<OrderId orderId={orderId} />
		</div>
	);
}
