"use client";

import { isBefore, startOfToday } from "date-fns";
import { Loader2, Minus, Plus } from "lucide-react";
import { type FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { useIsMobile } from "@/shared/hooks";
import { createNestedTextResolver, useUiContent } from "@/shared/ui-content";
import { Button } from "@/shared/ui/shadcn-ui/button";
import { Calendar } from "@/shared/ui/shadcn-ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/shared/ui/shadcn-ui/card";

import {
	ENUM_FORM_PREVIEW_BOOKING,
	type TPreviewBookingSchema
} from "@/entities/tour/preview-booking";
import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

import { TourBookingOptionCard } from "../tour-booking-option-card";

interface IStep1Props {
	onMonthChange: (month: Date) => void;
	options: IPreviewOptionCard[];
	availableDates: Date[];
	isOptionsLoading: boolean;
	isOptionLocked?: boolean;
}

export const Step1DateTravellers: FC<IStep1Props> = ({
	onMonthChange,
	options,
	availableDates,
	isOptionsLoading,
	isOptionLocked = false
}) => {
	const isMobile = useIsMobile();
	const { booking } = useUiContent();
	const t = createNestedTextResolver(
		booking as unknown as Record<string, unknown>
	);
	const form = useFormContext<TPreviewBookingSchema>();
	const count = form.watch(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT);
	const selectedOptionId = form.watch(ENUM_FORM_PREVIEW_BOOKING.OPTION_ID);
	const selectedDate = form.watch(ENUM_FORM_PREVIEW_BOOKING.DATE);

	useEffect(() => {
		const currentArr =
			form.getValues(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS) || [];
		if (currentArr.length < count) {
			const toAdd = count - currentArr.length;
			const newArr = [...currentArr, ...Array(toAdd).fill({})];
			form.setValue(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS, newArr);
		} else if (currentArr.length > count) {
			form.setValue(
				ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS,
				currentArr.slice(0, count)
			);
		}
	}, [count, form]);

	return (
		<div className="flex flex-col gap-6 w-full">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{booking.step1.startDate.title}
					</CardTitle>
					<CardDescription>
						{booking.step1.startDate.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex justify-center border-t pt-4">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => {
								if (date) {
									form.setValue(
										ENUM_FORM_PREVIEW_BOOKING.DATE,
										date,
										{ shouldValidate: true }
									);
								}
							}}
							disabled={(date) =>
								isBefore(date, startOfToday()) ||
								!availableDates.some(
									(d) =>
										d.getFullYear() ===
											date.getFullYear() &&
										d.getMonth() === date.getMonth() &&
										d.getDate() === date.getDate()
								)
							}
							showOutsideDays={false}
							numberOfMonths={isMobile ? 1 : 2}
							pagedNavigation
							onMonthChange={onMonthChange}
							classNames={{
								months: "flex flex-col md:flex-row gap-8 md:gap-20",
								month: "relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px md:before:-left-4"
							}}
						/>
					</div>
					{form.formState.errors[ENUM_FORM_PREVIEW_BOOKING.DATE] && (
						<p className="text-sm text-destructive text-center">
							{t(
								form.formState.errors[
									ENUM_FORM_PREVIEW_BOOKING.DATE
								]?.message as string
							)}
						</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{booking.step1.travellers.title}
					</CardTitle>
					<CardDescription>
						{booking.step1.travellers.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex items-center justify-between border-t pt-4">
						<div>
							<p className="font-medium">
								{booking.step1.travellers.title}
							</p>
							<p className="text-xs text-muted-foreground">
								{booking.step1.travellers.maxLimit}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="size-8 rounded-full"
								disabled={count <= 1}
								onClick={() =>
									form.setValue(
										ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT,
										count - 1,
										{ shouldValidate: true }
									)
								}
							>
								<Minus className="size-4" />
							</Button>
							<span className="w-4 text-center font-medium">
								{count}
							</span>
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="size-8 rounded-full"
								disabled={count >= 20}
								onClick={() =>
									form.setValue(
										ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT,
										count + 1,
										{ shouldValidate: true }
									)
								}
							>
								<Plus className="size-4" />
							</Button>
						</div>
					</div>
					{form.formState.errors[
						ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
					] && (
						<p className="text-sm text-destructive">
							{t(
								form.formState.errors[
									ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
								]?.message as string
							)}
						</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{booking.step1.options.title}
					</CardTitle>
					<CardDescription>
						{isOptionLocked
							? booking.step1.options.locked
							: booking.step1.options.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{isOptionsLoading ? (
						<div className="flex justify-center py-8">
							<Loader2 className="size-6 animate-spin text-muted-foreground" />
						</div>
					) : (
						<div className="flex flex-col gap-4">
							{options.map((opt) => (
								<TourBookingOptionCard
									key={opt.id}
									option={opt}
									isSelected={selectedOptionId === opt.id}
									disabled={isOptionLocked}
									onSelect={(optionId) =>
										form.setValue(
											ENUM_FORM_PREVIEW_BOOKING.OPTION_ID,
											optionId,
											{ shouldValidate: true }
										)
									}
								/>
							))}
						</div>
					)}

					{form.formState.errors[
						ENUM_FORM_PREVIEW_BOOKING.OPTION_ID
					] && (
						<p className="text-sm text-destructive">
							{t(
								form.formState.errors[
									ENUM_FORM_PREVIEW_BOOKING.OPTION_ID
								]?.message as string
							)}
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
