"use client";

import { ChevronLeft } from "lucide-react";
import { type FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { Badge, Button } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import {
	BOOKING_ORDER_STATUS_VARIANTS,
	type ENUM_INVOICE_STATUS_TYPE,
	ENUM_ORDER_STATUS,
	type ENUM_ORDER_STATUS_TYPE,
	INVOICE_STATUS_VARIANTS
} from "@/entities/booking";

import { getOrderStatusLabel } from "../../orders/model";

type TOrderHeaderProps = {
	orderNumber: string;
	status: ENUM_ORDER_STATUS_TYPE;
	invoiceStatus?: ENUM_INVOICE_STATUS_TYPE;
};

const getInvoiceStatusLabel = (
	labels: Record<string, string>,
	status: ENUM_INVOICE_STATUS_TYPE
): string => labels[status] ?? status;

export const OrderHeader: FC<TOrderHeaderProps> = ({
	orderNumber,
	status,
	invoiceStatus
}) => {
	const { orders } = useUiContent();

	const showInvoiceStatus =
		status === ENUM_ORDER_STATUS.BOOKING ||
		status === ENUM_ORDER_STATUS.COMPLETED ||
		status === ENUM_ORDER_STATUS.IN_PROGRESS;

	const showExport =
		status === ENUM_ORDER_STATUS.IN_PROGRESS ||
		status === ENUM_ORDER_STATUS.COMPLETED ||
		status === ENUM_ORDER_STATUS.BOOKING ||
		status === ENUM_ORDER_STATUS.IN_PROCESSING;

	return (
		<div className="grid gap-5">
			<div>
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="text-primary"
				>
					<Link href={ENUM_PATH.BOOKING.ROOT}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						{orders.buttons.back}
					</Link>
				</Button>
			</div>
			<div className="grid gap-2">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-3">
						<h1 className="text-3xl">{orderNumber}</h1>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">
									{orders.header.orderStatus}:
								</span>
								<Badge
									variant={
										BOOKING_ORDER_STATUS_VARIANTS[status]
									}
									className={cn(
										"px-3 py-1 text-xs font-bold"
									)}
								>
									{getOrderStatusLabel(
										orders.statuses,
										status
									)}
								</Badge>
							</div>

							{invoiceStatus && showInvoiceStatus && (
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										{orders.header.invoiceStatus}:
									</span>
									<Badge
										variant={
											INVOICE_STATUS_VARIANTS[
												invoiceStatus
											]
										}
										className={cn(
											"px-3 py-1 text-xs font-bold"
										)}
									>
										{getInvoiceStatusLabel(
											orders.invoiceStatuses,
											invoiceStatus
										)}
									</Badge>
								</div>
							)}
						</div>
					</div>
					{showExport && (
						<Button variant="slate" type="button">
							{orders.buttons.export}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
