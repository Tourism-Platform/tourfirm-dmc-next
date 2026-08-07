"use client";

import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { type FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useUiContent } from "@/shared/ui-content";
import { Button } from "@/shared/ui/shadcn-ui/button";
import { Card, CardContent } from "@/shared/ui/shadcn-ui/card";

import type { TSubmittedBooking } from "@/entities/booking";
import {
	ENUM_FORM_PREVIEW_BOOKING,
	type TPreviewBookingSchema
} from "@/entities/tour/preview-booking";
import type {
	IPreviewOptionCard,
	IPreviewTourGeneral
} from "@/entities/tour/preview-tour";

type TSidebarAction = {
	label: string;
	isLoading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit";
	form?: string;
	onClick?: () => void;
};

interface ISidebarProps {
	tourData?: IPreviewTourGeneral;
	options: IPreviewOptionCard[];
	submittedBooking?: TSubmittedBooking | null;
	action?: TSidebarAction;
}

const parsePrice = (price: string) =>
	parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0;

export const CatalogTourBookingSidebar: FC<ISidebarProps> = ({
	tourData,
	options,
	submittedBooking,
	action
}) => {
	const { booking } = useUiContent();
	const form = useFormContext<TPreviewBookingSchema>();

	const date = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.DATE
	});
	const count = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
	});
	const optionId = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.OPTION_ID
	});

	const selectedOption = options.find((opt) => opt.id === optionId);
	const pricePerPerson = selectedOption
		? parsePrice(selectedOption.price)
		: submittedBooking
			? parseFloat(submittedBooking.tourAmount) / submittedBooking.pax
			: 0;
	const travellersCount = submittedBooking?.pax ?? count ?? 1;
	const total = submittedBooking
		? parseFloat(submittedBooking.tourAmount)
		: pricePerPerson * travellersCount;

	const startDate = submittedBooking?.date
		? new Date(submittedBooking.date)
		: date;
	const endDate = submittedBooking?.endDate
		? new Date(submittedBooking.endDate)
		: startDate
			? new Date(startDate)
			: undefined;

	const durationDays =
		typeof tourData?.duration === "object"
			? tourData.duration.to || tourData.duration.from || 1
			: Number(tourData?.duration || 1);

	if (endDate && startDate && !submittedBooking?.endDate) {
		endDate.setDate(startDate.getDate() + durationDays);
	}

	return (
		<Card className="sticky top-24 w-full shrink-0">
			<CardContent className="flex flex-col p-6">
				<h3 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
					{booking.sidebar.title}
				</h3>
				<p className="mb-6 text-base font-semibold">
					{tourData?.tourTitle || "..."}
				</p>

				<div className="mb-6 flex flex-col gap-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{booking.sidebar.startDate}
						</span>
						<span className="text-right font-medium">
							{startDate
								? format(startDate, "MMM dd, yyyy")
								: booking.sidebar.notSelected}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{booking.sidebar.endDate}
						</span>
						<span className="text-right font-medium">
							{endDate
								? format(endDate, "MMM dd, yyyy")
								: booking.sidebar.notSelected}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{booking.sidebar.duration}
						</span>
						<span className="text-right font-medium">
							{durationDays} {booking.sidebar.days}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{booking.sidebar.travellers}
						</span>
						<span className="text-right font-medium">
							{travellersCount || booking.sidebar.notSelected}{" "}
							{travellersCount ? booking.sidebar.person : ""}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{booking.sidebar.package}
						</span>
						<span className="text-right font-medium">
							{selectedOption?.title ||
								booking.sidebar.notSelected}
						</span>
					</div>
				</div>

				<div className="mb-4 flex justify-between border-y py-4">
					<span className="text-sm text-muted-foreground">
						{booking.sidebar.pricePerPerson}
					</span>
					<span className="font-semibold">
						{submittedBooking?.tourCurrency ?? "$"}
						{pricePerPerson.toFixed(2)}
					</span>
				</div>

				<div className="mb-6 flex items-end justify-between">
					<span className="font-semibold">
						{booking.sidebar.estimatedTotal}
					</span>
					<div className="flex flex-col items-end">
						<span className="text-2xl font-bold">
							{submittedBooking?.tourCurrency ?? "$"}
							{total.toFixed(2)}
						</span>
						{travellersCount > 0 && pricePerPerson > 0 && (
							<span className="text-xs text-muted-foreground">
								{travellersCount} {booking.sidebar.person} X{" "}
								{submittedBooking?.tourCurrency ?? "$"}
								{pricePerPerson.toFixed(2)}
							</span>
						)}
					</div>
				</div>

				{action ? (
					<Button
						type={action.type ?? "button"}
						form={action.form}
						className="w-full"
						disabled={action.disabled || action.isLoading}
						onClick={action.onClick}
					>
						{action.isLoading ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : null}
						{action.label}
					</Button>
				) : null}
			</CardContent>
		</Card>
	);
};
