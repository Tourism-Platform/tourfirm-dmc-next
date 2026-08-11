"use client";

import { ArrowLeft } from "lucide-react";
import { type FC } from "react";
import { FormProvider } from "react-hook-form";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useIsMobile } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";
import { useUiContent } from "@/shared/ui-content";
import { withErrorBoundary } from "@/shared/ui/error-boundary";
import { Button } from "@/shared/ui/shadcn-ui/button";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTrigger
} from "@/shared/ui/shadcn-ui/stepper";

import { useTourBooking } from "../model/hooks/use-tour-booking";

import { BookingStepperCarousel } from "./booking-stepper-carousel";
import { Step1DateTravellers } from "./steps/step1-date-travellers";
import { Step2TravellerDetails } from "./steps/step2-traveller-details";
import { Step3Confirmation } from "./steps/step3-confirmation";
import { TourBookingSidebar } from "./tour-booking-sidebar";

const BOOKING_FORM_ID = "tour-booking-form";

interface ITourBookingProps {
	tourId: string;
	bookingId?: string;
}

const TourBookingBase: FC<ITourBookingProps> = ({ tourId, bookingId }) => {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { booking } = useUiContent();
	const {
		form,
		currentStep,
		handleNextStep,
		handlePrevStep,
		handleAddTraveller,
		handleRemoveTraveller,
		canAddTraveller,
		onSubmit,
		isLoading,
		isPaxLoading,
		isCreating,
		isUpdating,
		submittedBooking,
		tourData,
		options,
		availableDates,
		availableLanguages,
		handleCalendarMonthChange,
		isOptionsLoading
	} = useTourBooking({ tourId, bookingId });

	const STEPS = [
		{
			step: 1,
			label: booking.stepper.step1.label,
			title: booking.stepper.step1.title
		},
		{
			step: 2,
			label: booking.stepper.step2.label,
			title: booking.stepper.step2.title
		},
		{
			step: 3,
			label: booking.stepper.step3.label,
			title: booking.stepper.step3.title
		}
	];
	const LAST_STEP = STEPS[STEPS.length - 1].step;
	const isStepActionLoading =
		currentStep === 1 ? isCreating || isUpdating : isLoading;

	const sidebarAction =
		currentStep === 1
			? {
					label: booking.step1.continue,
					onClick: handleNextStep,
					isLoading: isStepActionLoading,
					type: "button" as const
				}
			: currentStep === 2
				? {
						label: booking.step2.submit,
						type: "submit" as const,
						form: BOOKING_FORM_ID,
						isLoading: isStepActionLoading
					}
				: undefined;

	return (
		<FormProvider {...form}>
			<div className="w-full py-8">
				{currentStep < LAST_STEP && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="mb-8 w-fit"
						onClick={() =>
							router.push(
								buildRoute(ENUM_PATH.TOURS.TOUR, { tourId })
							)
						}
					>
						<ArrowLeft className="h-4 w-4" />
						{booking.backToTour}
					</Button>
				)}

				<div
					className={`mb-8 ${currentStep === LAST_STEP ? "mx-auto max-w-3xl" : "w-full"}`}
				>
					{isMobile ? (
						<BookingStepperCarousel
							steps={STEPS}
							currentStep={currentStep}
						/>
					) : (
						<Stepper value={currentStep}>
							{STEPS.map(({ step, label, title }, index) => (
								<StepperItem
									key={step}
									step={step}
									className="not-last:flex-1"
								>
									<StepperTrigger asChild>
										<StepperIndicator />
									</StepperTrigger>
									<div className="ml-2 flex flex-col">
										<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
											{label}
										</span>
										<span
											className={`text-sm font-medium ${step === currentStep ? "text-foreground" : "text-muted-foreground"}`}
										>
											{title}
										</span>
									</div>
									{index < STEPS.length - 1 && (
										<StepperSeparator />
									)}
								</StepperItem>
							))}
						</Stepper>
					)}
				</div>

				<div
					className={`grid items-start gap-8 ${currentStep < LAST_STEP ? "grid-cols-1 lg:grid-cols-[1fr_360px]" : "grid-cols-1"}`}
				>
					<form
						id={BOOKING_FORM_ID}
						onSubmit={form.handleSubmit(onSubmit)}
						className={`flex w-full min-w-0 flex-col gap-8 ${currentStep === LAST_STEP ? "mx-auto max-w-3xl" : ""}`}
					>
						{currentStep === 1 && (
							<Step1DateTravellers
								onMonthChange={handleCalendarMonthChange}
								options={options}
								availableDates={availableDates}
								availableLanguages={availableLanguages}
								isOptionsLoading={isOptionsLoading}
								isOptionLocked={!!bookingId}
							/>
						)}
						{currentStep === 2 && (
							<Step2TravellerDetails
								onPrev={handlePrevStep}
								onAddTraveller={handleAddTraveller}
								onRemoveTraveller={handleRemoveTraveller}
								canAddTraveller={canAddTraveller}
								isLoading={isLoading}
								isPaxLoading={isPaxLoading}
							/>
						)}
						{currentStep === 3 && (
							<Step3Confirmation
								submittedBooking={submittedBooking}
								tourData={tourData}
								options={options}
							/>
						)}
					</form>

					{currentStep < LAST_STEP && (
						<TourBookingSidebar
							tourData={tourData}
							options={options}
							submittedBooking={submittedBooking}
							action={sidebarAction}
						/>
					)}
				</div>
			</div>
		</FormProvider>
	);
};

export const TourBooking = withErrorBoundary(TourBookingBase);
