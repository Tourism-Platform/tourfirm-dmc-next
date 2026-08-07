"use client";

import { format } from "date-fns";
import { Check, Clock, Copy, DollarSign, Star, ThumbsUp } from "lucide-react";
import { type FC, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ENUM_PATH } from "@/shared/config";
import { useRouter } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useUiContent } from "@/shared/ui-content";
import { Button } from "@/shared/ui/shadcn-ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/shared/ui/shadcn-ui/card";

import type { TSubmittedBooking } from "@/entities/booking";
import {
	ENUM_FORM_PREVIEW_BOOKING,
	type TPreviewBookingSchema
} from "@/entities/tour/preview-booking";
import type {
	IPreviewOptionCard,
	IPreviewTourGeneral
} from "@/entities/tour/preview-tour";

interface IStep3Props {
	submittedBooking?: TSubmittedBooking | null;
	tourData?: IPreviewTourGeneral;
	options: IPreviewOptionCard[];
}

const TIMELINE_KEYS = [
	"requestSubmitted",
	"providerReview",
	"bookingConfirmed",
	"paymentInfo",
	"voucherTime"
] as const;

const TIMELINE_ICONS = [Check, Clock, ThumbsUp, DollarSign, Star];

export const Step3Confirmation: FC<IStep3Props> = ({
	submittedBooking,
	tourData,
	options
}) => {
	const { booking } = useUiContent();
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const form = useFormContext<TPreviewBookingSchema>();

	const optionId = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.OPTION_ID
	});
	const count = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
	});
	const date = useWatch({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.DATE
	});

	const bookingId = submittedBooking?.id ?? "";
	const selectedOption = options.find((opt) => opt.id === optionId);
	const total = submittedBooking
		? parseFloat(submittedBooking.tourAmount)
		: 0;

	const handleCopy = async () => {
		if (!bookingId) return;

		try {
			await navigator.clipboard.writeText(bookingId);
			setCopied(true);
			toast.success(booking.step3.copied);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error(booking.step3.copyFailed);
		}
	};

	return (
		<div className="flex w-full flex-col items-center gap-8 py-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="justify-items-center text-center">
					<div className="mb-2 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
						<Check className="size-8 text-emerald-500" />
					</div>
					<CardTitle className="text-2xl font-bold">
						{booking.step3.successTitle}
					</CardTitle>
					<CardDescription className="mx-auto max-w-md text-center">
						{booking.step3.successDesc}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<div className="flex max-w-full items-center gap-2 rounded-lg border bg-muted px-3 py-1.5">
						<span className="shrink-0 text-xs font-medium text-muted-foreground">
							{booking.step3.bookingId}
						</span>
						<span className="min-w-0 break-all font-mono text-xs font-semibold leading-snug">
							{bookingId}
						</span>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-6 shrink-0"
							onClick={handleCopy}
						>
							{copied ? (
								<Check className="size-3 text-emerald-500" />
							) : (
								<Copy className="size-3 text-muted-foreground" />
							)}
						</Button>
					</div>

					<div className="relative flex w-full flex-col gap-6 before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-px before:bg-border">
						{TIMELINE_KEYS.map((key, index) => {
							const Icon = TIMELINE_ICONS[index];
							const item = booking.step3.timeline[key];
							const isActive = index === 0;
							const isPending = index === 1;

							return (
								<div
									key={key}
									className="relative z-10 flex gap-4"
								>
									<div
										className={cn(
											"flex size-7 shrink-0 items-center justify-center rounded-full border bg-card",
											isActive &&
												"border-emerald-500 text-emerald-500",
											isPending &&
												"border-emerald-500/50 text-emerald-500/70",
											!isActive &&
												!isPending &&
												"border-border text-muted-foreground"
										)}
									>
										<Icon className="size-3.5" />
									</div>
									<div className="flex flex-col gap-1 pt-0.5">
										<p className="text-sm font-semibold">
											{item.title}
										</p>
										<p className="text-xs text-muted-foreground">
											{item.desc}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					<div className="flex w-full flex-col gap-3 rounded-xl bg-muted p-6">
						<h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
							{booking.step3.summary.title}
						</h4>
						<div className="grid gap-2 text-sm">
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">
									{booking.step3.summary.tour}
								</span>
								<span className="text-right font-medium">
									{tourData?.tourTitle}
								</span>
							</div>
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">
									{booking.step3.summary.startDate}
								</span>
								<span className="font-medium">
									{submittedBooking?.date
										? format(
												new Date(submittedBooking.date),
												"MMM dd, yyyy"
											)
										: date
											? format(date, "MMM dd, yyyy")
											: "-"}
								</span>
							</div>
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">
									{booking.step3.summary.endDate}
								</span>
								<span className="font-medium">
									{submittedBooking?.endDate
										? format(
												new Date(
													submittedBooking.endDate
												),
												"MMM dd, yyyy"
											)
										: "-"}
								</span>
							</div>
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">
									{booking.step3.summary.travellers}
								</span>
								<span className="font-medium">
									{submittedBooking?.pax ?? count}
								</span>
							</div>
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">
									{booking.step3.summary.package}
								</span>
								<span className="font-medium">
									{selectedOption?.title ?? "-"}
								</span>
							</div>
						</div>
						<div className="mt-2 flex items-end justify-between border-t pt-4">
							<span className="font-semibold">
								{booking.step3.summary.estimatedTotal}
							</span>
							<span className="text-2xl font-bold">
								{submittedBooking?.tourCurrency ?? "$"}
								{total.toFixed(2)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-center gap-4">
				<Button
					type="button"
					onClick={() => router.push(ENUM_PATH.BOOKING.ROOT)}
				>
					{booking.step3.viewMyBookings}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(ENUM_PATH.TOURS.ROOT)}
				>
					{booking.step3.catalogue}
				</Button>
			</div>
		</div>
	);
};
