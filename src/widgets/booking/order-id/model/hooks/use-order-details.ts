import { useMemo } from "react";

import { useUiContent } from "@/shared/ui-content";

import { useGetAuthAccountQuery } from "@/entities/auth";
import {
	mapBookingItineraryToTourReviewItems,
	mapBookingPaxListToPaxReview,
	resolveBookingOrderDetailApi,
	useGetAgencyBookingOrderQuery,
	useGetBookingItineraryQuery,
	useGetOperatorBookingOrderQuery,
	useGetUserBookingOrderQuery,
	useListPassengerInfoQuery
} from "@/entities/booking";

import { useRequireAuth } from "@/features/auth";

import { getContactItems, getOrderItems } from "../helpers";

export const useOrderDetails = (orderId: string) => {
	const { orders } = useUiContent();
	const { isReady, isChecking } = useRequireAuth();
	const { data: authAccount } = useGetAuthAccountQuery(undefined, {
		skip: !isReady
	});

	const detailApi = resolveBookingOrderDetailApi(authAccount?.role);
	const skipBase = !orderId || !isReady;

	const userOrderQuery = useGetUserBookingOrderQuery(orderId, {
		skip: skipBase || detailApi !== "user"
	});
	const agencyOrderQuery = useGetAgencyBookingOrderQuery(orderId, {
		skip: skipBase || detailApi !== "agency"
	});
	const operatorOrderQuery = useGetOperatorBookingOrderQuery(orderId, {
		skip: skipBase || detailApi !== "operator"
	});

	const orderQuery =
		detailApi === "agency"
			? agencyOrderQuery
			: detailApi === "operator"
				? operatorOrderQuery
				: userOrderQuery;
	const order = orderQuery.data;

	const itineraryQuery = useGetBookingItineraryQuery(orderId, {
		skip: skipBase
	});

	const paxQuery = useListPassengerInfoQuery(orderId, {
		skip: skipBase
	});

	const orderItems = useMemo(
		() => (order ? getOrderItems(order, orders.orderInfo.fields) : []),
		[order, orders.orderInfo.fields]
	);

	const contactItems = useMemo(
		() => getContactItems(order?.operator, orders.contactInfo.fields),
		[order?.operator, orders.contactInfo.fields]
	);

	const paxDetails = useMemo(
		() => mapBookingPaxListToPaxReview(paxQuery.data ?? []),
		[paxQuery.data]
	);

	const tourReviewItems = useMemo(
		() => mapBookingItineraryToTourReviewItems(itineraryQuery.data),
		[itineraryQuery.data]
	);

	const isLoading =
		isChecking ||
		skipBase ||
		orderQuery.isLoading ||
		itineraryQuery.isLoading ||
		paxQuery.isLoading;

	return {
		order,
		orderItems,
		contactItems,
		paxDetails,
		tourReviewItems,
		isLoading,
		isOrderLoading: orderQuery.isLoading,
		isPaxLoading: paxQuery.isLoading,
		isItineraryLoading: itineraryQuery.isLoading
	};
};
