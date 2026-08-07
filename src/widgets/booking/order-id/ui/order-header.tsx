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
	type ENUM_ORDER_STATUS_TYPE
} from "@/entities/booking";

import { getOrderStatusLabel } from "../../orders/model";

type TOrderHeaderProps = {
	orderId: string;
	status: ENUM_ORDER_STATUS_TYPE;
};

export const OrderHeader: FC<TOrderHeaderProps> = ({ orderId, status }) => {
	const { orders } = useUiContent();

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
						<h1 className="text-3xl">{orderId}</h1>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">
								{orders.header.orderStatus}:
							</span>
							<Badge
								variant={BOOKING_ORDER_STATUS_VARIANTS[status]}
								className={cn("px-3 py-1 text-xs font-bold")}
							>
								{getOrderStatusLabel(orders.statuses, status)}
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
