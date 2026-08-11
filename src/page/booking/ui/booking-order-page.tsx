"use client";

import { OrderId } from "@/widgets/booking";

type TProps = {
	orderId: string;
};

export function BookingOrderPage({ orderId }: TProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col pt-10">
			<OrderId orderId={orderId} />
		</div>
	);
}
