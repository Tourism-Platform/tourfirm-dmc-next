"use client";

import { type FC } from "react";

import { useUiContent } from "@/shared/ui-content";

import { ENUM_ORDER_STATUS } from "@/entities/booking";

import { useOrderDetails } from "../model/hooks/use-order-details";

import { OrderHeader } from "./order-header";
import { OrderIdSkeleton } from "./order-id-skeleton";
import { OrderInfoCard } from "./order-info-card";
import { OrderNotFound } from "./order-not-found";
import { OrderPaxReview } from "./order-pax-review";

type TOrderIdProps = {
	orderId: string;
};

export const OrderId: FC<TOrderIdProps> = ({ orderId }) => {
	const { orders } = useUiContent();
	const { order, orderItems, contactItems, paxDetails, isLoading } =
		useOrderDetails(orderId);

	if (isLoading) {
		return <OrderIdSkeleton />;
	}

	if (!order) {
		return <OrderNotFound />;
	}

	return (
		<div className="flex flex-col gap-8 text-foreground">
			<OrderHeader
				orderId={order.orderNumber ?? order.orderId}
				status={order.status}
			/>

			<div className="grid gap-6 md:grid-cols-2">
				<OrderInfoCard
					title={orders.orderInfo.title}
					items={orderItems}
				/>

				<OrderInfoCard
					title={orders.contactInfo.title}
					items={contactItems}
				/>
			</div>

			{order.status !== ENUM_ORDER_STATUS.CANCELLED && (
				<OrderPaxReview items={paxDetails} />
			)}
		</div>
	);
};
