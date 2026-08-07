"use client";

import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { type FC, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib";
import { createNestedTextResolver, useUiContent } from "@/shared/ui-content";
import { CustomField } from "@/shared/ui/custom/custom-field";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/shared/ui/shadcn-ui/accordion";
import { Button } from "@/shared/ui/shadcn-ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/shared/ui/shadcn-ui/card";

import {
	Gender,
	type ITravellerPaxInput,
	isTravellerComplete
} from "@/entities/booking";
import {
	ENUM_FORM_PREVIEW_BOOKING,
	type TPreviewBookingSchema
} from "@/entities/tour/preview-booking";

interface IStep2Props {
	onPrev: () => void;
	onAddTraveller: () => void;
	onRemoveTraveller: (index: number) => void;
	canAddTraveller: boolean;
	isLoading: boolean;
	isPaxLoading: boolean;
}

const GENDER_OPTIONS = [
	{
		value: Gender.M,
		labelKey: "step2.fields.gender.options.male"
	},
	{
		value: Gender.F,
		labelKey: "step2.fields.gender.options.female"
	}
] as const;

export const Step2TravellerDetails: FC<IStep2Props> = ({
	onPrev,
	onAddTraveller,
	onRemoveTraveller,
	canAddTraveller,
	isLoading,
	isPaxLoading
}) => {
	const { booking } = useUiContent();
	const t = createNestedTextResolver(
		booking as unknown as Record<string, unknown>
	);
	const form = useFormContext<TPreviewBookingSchema>();
	const { fields } = useFieldArray({
		control: form.control,
		name: ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS
	});
	const travellers = form.watch(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS);

	const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

	const openItems = openIndexes
		.filter((index) => index < fields.length)
		.map((index) => fields[index].id);

	const handleOpenChange = (ids: string[]) => {
		setOpenIndexes(
			ids
				.map((id) => fields.findIndex((field) => field.id === id))
				.filter((index) => index >= 0)
		);
	};

	if (isPaxLoading) {
		return (
			<div className="flex justify-center py-16">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 w-full">
			<Card>
				<CardHeader className="border-b max-sm:has-data-[slot=card-action]:grid-cols-1">
					<CardTitle className="text-lg">
						{booking.step2.title}
					</CardTitle>
					<CardDescription>
						{booking.step2.description}
					</CardDescription>
					{fields.length > 0 && (
						<CardAction className="flex flex-wrap gap-2 max-sm:col-span-1 max-sm:col-start-1 max-sm:row-span-1 max-sm:row-start-auto max-sm:mt-2 max-sm:justify-self-start">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									setOpenIndexes(
										fields.map((_, index) => index)
									)
								}
							>
								{booking.step2.showAll}
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setOpenIndexes([])}
							>
								{booking.step2.hideAll}
							</Button>
						</CardAction>
					)}
				</CardHeader>
				<CardContent className="flex flex-col gap-4 pt-6">
					<Accordion
						type="multiple"
						value={openItems}
						onValueChange={handleOpenChange}
						className="flex w-full flex-col gap-4"
					>
						{fields.map((field, index) => {
							const prefix = `${ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS}.${index}.`;
							const isLead = index === 0;
							const isComplete = isTravellerComplete(
								(travellers?.[index] ??
									{}) as ITravellerPaxInput
							);

							return (
								<AccordionItem
									key={field.id}
									value={field.id}
									className={cn(
										"relative rounded-xl border px-4 py-2 last:border-b transition-[box-shadow,border-color]",
										isComplete &&
											"border-emerald-500/50 ring-2 ring-emerald-500/30 shadow-sm shadow-emerald-500/10"
									)}
								>
									{isComplete && (
										<CheckCircle2
											aria-label={booking.step2.filled}
											className="pointer-events-none absolute top-2 right-2 size-5 text-emerald-500"
										/>
									)}
									<div className="flex w-full items-center gap-1 pr-7">
										<AccordionTrigger className="flex-1 py-3 hover:no-underline">
											<div className="flex flex-col items-start gap-1 text-left">
												<div className="flex items-center gap-2">
													<span className="text-base font-semibold">
														{
															booking.step2
																.traveller
														}{" "}
														{index + 1}
													</span>
													{isLead && (
														<>
															<span className="size-1 rounded-full bg-primary" />
															<span className="text-sm font-medium text-primary">
																{
																	booking
																		.step2
																		.lead
																}
															</span>
														</>
													)}
												</div>
												<span className="text-xs font-normal text-muted-foreground">
													{booking.step2.optionalHint}
												</span>
											</div>
										</AccordionTrigger>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
											disabled={isLoading}
											onClick={() =>
												onRemoveTraveller(index)
											}
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
									<AccordionContent className="px-1 pt-4 pb-4">
										<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.FIRST_NAME}`}
												control={form.control}
												label={
													booking.step2.fields
														.firstName.label
												}
												placeholder={
													booking.step2.fields
														.firstName.label
												}
												fieldType="input"
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.LAST_NAME}`}
												control={form.control}
												label={
													booking.step2.fields
														.lastName.label
												}
												placeholder={
													booking.step2.fields
														.lastName.label
												}
												fieldType="input"
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.GENDER}`}
												control={form.control}
												label={
													booking.step2.fields.gender
														.label
												}
												placeholder={
													booking.step2.fields.gender
														.label
												}
												fieldType="select"
												options={GENDER_OPTIONS.map(
													(option) => ({
														value: option.value,
														label: t(
															option.labelKey
														)
													})
												)}
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.DATE_OF_BIRTH}`}
												control={form.control}
												label={
													booking.step2.fields
														.dateOfBirth.label
												}
												fieldType="date"
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.NATIONALITY}`}
												control={form.control}
												label={
													booking.step2.fields
														.nationality.label
												}
												placeholder={
													booking.step2.fields
														.nationality.label
												}
												emptyText="step2.fields.nationality.empty"
												fieldType="country"
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.PASSPORT_NUMBER}`}
												control={form.control}
												label={
													booking.step2.fields
														.passportNumber.label
												}
												placeholder={
													booking.step2.fields
														.passportNumber.label
												}
												fieldType="input"
												t={t}
											/>
											<CustomField
												name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.PASSPORT_EXPIRY}`}
												control={form.control}
												label={
													booking.step2.fields
														.passportExpiry.label
												}
												fieldType="date"
												t={t}
											/>
											<div className="sm:col-span-2">
												<CustomField
													name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.FILE}`}
													control={form.control}
													label={
														booking.step2.fields
															.file.label
													}
													fieldType="upload"
													maxFiles={1}
													showAllRemoveButton={false}
													showTopTitle={false}
													t={t}
												/>
											</div>
											<div className="sm:col-span-2">
												<CustomField
													name={`${prefix}${ENUM_FORM_PREVIEW_BOOKING.NOTE}`}
													control={form.control}
													label={
														booking.step2.fields
															.note.label
													}
													placeholder={
														booking.step2.fields
															.note.label
													}
													fieldType="textarea"
													t={t}
												/>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>

					{canAddTraveller && (
						<Button
							type="button"
							variant="outline"
							className="w-fit"
							disabled={isLoading}
							onClick={onAddTraveller}
						>
							<Plus className="mr-2 size-4" />
							{booking.step2.addTraveller}
						</Button>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-start">
				<Button
					type="button"
					variant="outline"
					onClick={onPrev}
					className="w-32"
				>
					{booking.step2.back}
				</Button>
			</div>
		</div>
	);
};
