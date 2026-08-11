"use client";

import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import { type FC, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, SmartTable, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import {
	ENUM_ORDER_STATUS,
	type ENUM_ORDER_STATUS_TYPE,
	type IBookingOrderFilters,
	useGetBookingOrdersQuery
} from "@/entities/booking";

import { useRequireAuth } from "@/features/auth";

import { COLUMNS, getOrderStatusLabel } from "../model";

const STATUS_OPTIONS = Object.values(ENUM_ORDER_STATUS);

const OrdersBase: FC = () => {
	const { orders: ordersUi } = useUiContent();
	const { isReady, isChecking } = useRequireAuth();
	const { watch, setValue } = useForm<Required<IBookingOrderFilters>>({
		defaultValues: {
			status: [ENUM_ORDER_STATUS.NEW],
			search: "",
			page: 1,
			limit: 10
		}
	});

	const filters = watch();
	const skipQuery = !isReady;

	const {
		data: ordersData,
		isLoading,
		isFetching,
		isError
	} = useGetBookingOrdersQuery(
		{
			status: filters.status,
			search: filters.search,
			page: filters.page,
			limit: filters.limit
		},
		{ skip: skipQuery }
	);

	useEffect(() => {
		if (isError) {
			toast.error(ordersUi.toasts.load.error);
		}
	}, [isError, ordersUi.toasts.load.error]);

	const orders = useMemo(() => ordersData?.data ?? [], [ordersData]);
	const totalCount = ordersData?.total ?? 0;

	const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
		(updaterOrValue) => {
			const currentPagination = {
				pageIndex: filters.page - 1,
				pageSize: filters.limit
			};

			const nextValue =
				typeof updaterOrValue === "function"
					? updaterOrValue(currentPagination)
					: updaterOrValue;

			setValue("page", nextValue.pageIndex + 1);
			setValue("limit", nextValue.pageSize);
		},
		[filters.page, filters.limit, setValue]
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			setValue("search", value);
			setValue("page", 1);
		},
		[setValue]
	);

	const handleStatusTabChange = useCallback(
		(value: string) => {
			setValue("status", [value as ENUM_ORDER_STATUS_TYPE]);
			setValue("page", 1);
		},
		[setValue]
	);

	const statusTabs = useMemo(
		() =>
			STATUS_OPTIONS.map((status) => ({
				value: status,
				label: getOrderStatusLabel(ordersUi.statuses, status)
			})),
		[ordersUi.statuses]
	);

	const columns = useMemo(() => COLUMNS(ordersUi), [ordersUi]);

	const paginationObj = useMemo(
		() => ({
			pageIndex: filters.page - 1,
			pageSize: filters.limit
		}),
		[filters.page, filters.limit]
	);

	const showTableLoading = isChecking || skipQuery || isLoading || isFetching;

	return (
		<section className="flex min-h-0 flex-1 flex-col gap-5">
			<h1 className="text-3xl font-semibold">{ordersUi.pageName}</h1>
			<Card className="flex min-h-0 flex-1 flex-col">
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<SmartTable
						data={orders}
						columns={columns}
						recordCount={totalCount}
						isLoading={showTableLoading}
						loadingMode="skeleton"
						pagination={paginationObj}
						onPaginationChange={handlePaginationChange}
						search={filters.search}
						onSearchChange={handleSearchChange}
						statusTabs={statusTabs}
						activeStatusTab={filters.status[0]}
						onStatusTabChange={handleStatusTabChange}
						showStatusTabsFilter
						showStatusFilter={false}
					/>
				</CardContent>
			</Card>
		</section>
	);
};

export const Orders = withErrorBoundary(OrdersBase);
