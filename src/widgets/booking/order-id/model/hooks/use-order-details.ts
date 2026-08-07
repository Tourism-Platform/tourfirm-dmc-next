import { useMemo } from "react";

import { useUiContent } from "@/shared/ui-content";

import {
	useGetBookingOrderByIdQuery,
	useListPassengerInfoQuery
} from "@/entities/booking";

import { getContactItems, getOrderItems } from "../helpers";

export const useOrderDetails = (orderId: string) => {
	const { orders } = useUiContent();

	const orderQuery = useGetBookingOrderByIdQuery(orderId, {
		skip: !orderId
	});
	const order = orderQuery.data;

	const paxQuery = useListPassengerInfoQuery(orderId, {
		skip: !orderId
	});

	const orderItems = useMemo(
		() => (order ? getOrderItems(order, orders.orderInfo.fields) : []),
		[order, orders.orderInfo.fields]
	);

	const contactItems = useMemo(
		() => getContactItems(order?.user, orders.contactInfo.fields),
		[order?.user, orders.contactInfo.fields]
	);

	const paxDetails = useMemo(() => paxQuery.data ?? [], [paxQuery.data]);

	const isLoading = orderQuery.isLoading || paxQuery.isLoading;

	return {
		order,
		orderItems,
		contactItems,
		paxDetails,
		isLoading,
		isOrderLoading: orderQuery.isLoading,
		isPaxLoading: paxQuery.isLoading
	};
};
