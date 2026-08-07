import { type ColumnDef } from "@tanstack/react-table";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Badge, Skeleton } from "@/shared/ui";
import type { TUiOrders } from "@/shared/ui-content";

import {
	BOOKING_ORDER_STATUS_VARIANTS,
	type ENUM_ORDER_STATUS_TYPE,
	type IOrder
} from "@/entities/booking";

import { getOrderStatusLabel } from "./status-label";

export const COLUMNS = (ordersUi: TUiOrders): ColumnDef<IOrder>[] => {
	return [
		{
			header: ordersUi.table.orderId,
			accessorKey: "orderNumber",
			meta: {
				headerTitle: ordersUi.table.orderId,
				skeleton: <Skeleton className="h-4 w-[80px]" />
			},
			cell: ({ row }) => (
				<Link
					href={buildRoute(ENUM_PATH.BOOKING.ORDER, {
						orderId: row.original.orderId
					})}
					className="font-medium text-primary hover:underline"
				>
					{row.getValue("orderNumber") ?? row.original.orderId}
				</Link>
			),
			size: 120
		},
		{
			header: ordersUi.table.tourName,
			accessorKey: "tourName",
			meta: {
				headerTitle: ordersUi.table.tourName,
				skeleton: <Skeleton className="h-4 w-[120px]" />
			},
			cell: ({ row }) => (
				<div className="truncate font-medium">
					{row.getValue("tourName")}
				</div>
			),
			size: 160
		},
		{
			header: ordersUi.table.dates,
			accessorKey: "dates",
			meta: {
				headerTitle: ordersUi.table.dates,
				skeleton: <Skeleton className="h-4 w-[100px]" />
			},
			cell: ({ row }) => {
				const dates = row.original.dates;

				return (
					<span className="text-sm font-medium">
						{dates.from} - {dates.to}
					</span>
				);
			},
			size: 140
		},
		{
			header: ordersUi.table.pax,
			accessorKey: "pax",
			meta: {
				headerTitle: ordersUi.table.pax,
				skeleton: <Skeleton className="h-4 w-[40px]" />
			},
			size: 80
		},
		{
			header: ordersUi.header.orderStatus,
			accessorKey: "status",
			meta: {
				headerTitle: ordersUi.header.orderStatus,
				skeleton: <Skeleton className="h-5 w-[80px]" />
			},
			cell: ({ row }) => {
				const status = row.getValue("status") as ENUM_ORDER_STATUS_TYPE;

				return (
					<Badge
						variant={BOOKING_ORDER_STATUS_VARIANTS[status]}
						className="px-3 py-1 text-xs font-bold"
					>
						{getOrderStatusLabel(ordersUi.statuses, status)}
					</Badge>
				);
			},
			size: 120
		}
	];
};
