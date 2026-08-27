"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useRouter } from "@/shared/i18n";
import { formatDateToISO } from "@/shared/utils";

import {
	type ITravellerPaxInput,
	type TSubmittedBooking,
	getTravellerPassportFile,
	isTravellerComplete,
	mapBookingPaxToTravellerForm,
	mapTravellerToPaxCreate,
	mapTravellerToPaxUpdate,
	useAddPassengerInfoMutation,
	useCreateBookingOrderMutation,
	useDeletePassengerInfoMutation,
	useListPassengerInfoQuery,
	useSubmitBookingOrderMutation,
	useUpdateBookingOrderMutation,
	useUpdatePassengerInfoMutation,
	useUploadPassengerPassportMutation
} from "@/entities/booking";
import {
	ENUM_FORM_PREVIEW_BOOKING,
	PREVIEW_BOOKING_DEFAULT_VALUES,
	PREVIEW_BOOKING_SCHEMA,
	type TPreviewBookingSchema
} from "@/entities/tour/preview-booking";
import {
	parseLocalDateString,
	parseStoredLocalDate,
	useGetPreviewTourGeneralQuery,
	useGetPreviewTourOptionsQuery,
	useGetPreviewTourQuery,
	useGetPreviewTourScheduleQuery
} from "@/entities/tour/preview-tour";
import type { TEnumLanguagesType } from "@/entities/tour/preview-tour";

import {
	getInitialPreviewCalendarRange,
	getPreviewCalendarRangeForMonth,
	loadBookingDraft,
	saveBookingDraft
} from "../lib";

interface IUseTourBookingParams {
	tourId: string;
	bookingId?: string;
}

export const useTourBooking = ({
	tourId,
	bookingId: bookingIdParam
}: IUseTourBookingParams) => {
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(() =>
		bookingIdParam ? 2 : 1
	);
	const [submittedBooking, setSubmittedBooking] =
		useState<TSubmittedBooking | null>(null);
	const [calendarRange, setCalendarRange] = useState(
		getInitialPreviewCalendarRange
	);
	const hasSyncedPax = useRef(false);

	const { data: tourData, isLoading: isTourLoading } =
		useGetPreviewTourGeneralQuery(tourId, { skip: !tourId });

	const { data: previewLanding } = useGetPreviewTourQuery(tourId, {
		skip: !tourId
	});

	const availableLanguages: TEnumLanguagesType[] =
		previewLanding?.languages ?? [];

	const {
		data: options = [],
		isLoading: isOptionsLoading,
		isError: isOptionsError
	} = useGetPreviewTourOptionsQuery(tourId, { skip: !tourId });

	const { data: scheduleData } = useGetPreviewTourScheduleQuery(
		{
			tourId,
			from: calendarRange.from,
			to: calendarRange.to
		},
		{ skip: !tourId }
	);

	const availableDates = useMemo(
		() => (scheduleData?.occurrences ?? []).map(parseLocalDateString),
		[scheduleData?.occurrences]
	);

	const { data: paxList, isLoading: isPaxLoading } =
		useListPassengerInfoQuery(bookingIdParam ?? "", {
			skip: !bookingIdParam || currentStep !== 2
		});

	const [createBookingOrder, { isLoading: isCreating }] =
		useCreateBookingOrderMutation();
	const [updateBookingOrder, { isLoading: isUpdating }] =
		useUpdateBookingOrderMutation();
	const [addPassengerInfo, { isLoading: isAddingPax }] =
		useAddPassengerInfoMutation();
	const [updatePassengerInfo, { isLoading: isUpdatingPax }] =
		useUpdatePassengerInfoMutation();
	const [deletePassengerInfo, { isLoading: isDeletingPax }] =
		useDeletePassengerInfoMutation();
	const [uploadPassengerPassport, { isLoading: isUploadingPassport }] =
		useUploadPassengerPassportMutation();
	const [submitBookingOrder, { isLoading: isSubmitting }] =
		useSubmitBookingOrderMutation();

	const form = useForm<TPreviewBookingSchema>({
		resolver: zodResolver(
			PREVIEW_BOOKING_SCHEMA
		) as Resolver<TPreviewBookingSchema>,
		defaultValues: PREVIEW_BOOKING_DEFAULT_VALUES,
		mode: "onChange"
	});

	const travellersCount = form.watch(
		ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
	);
	const travellers = form.watch(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS);
	const canAddTraveller = (travellers?.length ?? 0) < (travellersCount ?? 0);

	const restoreDraft = useCallback(
		(bookingId: string) => {
			const draft = loadBookingDraft(bookingId);
			if (!draft || draft.tourId !== tourId) return;

			form.reset({
				date: parseStoredLocalDate(draft.date),
				travellers_count: draft.travellers_count,
				option_id: draft.option_id,
				language: draft.language,
				travellers: Array.from(
					{ length: draft.travellers_count },
					() => ({})
				)
			});
		},
		[form, tourId]
	);

	useEffect(() => {
		if (bookingIdParam) {
			restoreDraft(bookingIdParam);
		}
	}, [bookingIdParam, restoreDraft]);

	useEffect(() => {
		if (bookingIdParam || !availableLanguages.length) return;

		const currentLanguage = form.getValues(
			ENUM_FORM_PREVIEW_BOOKING.LANGUAGE
		);

		if (
			currentLanguage &&
			availableLanguages.includes(currentLanguage as TEnumLanguagesType)
		) {
			return;
		}

		form.setValue(
			ENUM_FORM_PREVIEW_BOOKING.LANGUAGE,
			availableLanguages[0],
			{ shouldValidate: true }
		);
	}, [availableLanguages, bookingIdParam, form]);

	useEffect(() => {
		if (bookingIdParam || !options.length) return;

		const currentOptionId = form.getValues(
			ENUM_FORM_PREVIEW_BOOKING.OPTION_ID
		);
		if (options.some((option) => option.id === currentOptionId)) {
			return;
		}

		form.setValue(ENUM_FORM_PREVIEW_BOOKING.OPTION_ID, options[0].id, {
			shouldValidate: true
		});
	}, [bookingIdParam, form, options]);

	useEffect(() => {
		hasSyncedPax.current = false;
	}, [bookingIdParam, currentStep]);

	useEffect(() => {
		if (currentStep !== 2 || !paxList || hasSyncedPax.current) return;

		const count = form.getValues(
			ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
		);
		const mapped = paxList.map(mapBookingPaxToTravellerForm);
		const emptySlots = Math.max(0, count - mapped.length);

		form.setValue(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS, [
			...mapped,
			...Array.from({ length: emptySlots }, () => ({}))
		]);
		hasSyncedPax.current = true;
	}, [currentStep, form, paxList]);

	const handleNextStep = async () => {
		const isValid = await form.trigger([
			"date",
			"travellers_count",
			"option_id",
			"language"
		]);

		if (!isValid) return;

		const formData = form.getValues();

		try {
			if (bookingIdParam) {
				await updateBookingOrder({
					id: bookingIdParam,
					date: formData.date,
					pax: formData.travellers_count
				}).unwrap();

				saveBookingDraft(bookingIdParam, {
					date: formatDateToISO(formData.date),
					travellers_count: formData.travellers_count,
					option_id: formData.option_id,
					language: formData.language,
					tourId
				});

				hasSyncedPax.current = false;
				setCurrentStep(2);
				return;
			}

			const created = await createBookingOrder({
				tourOptionId: formData.option_id,
				date: formData.date,
				pax: formData.travellers_count,
				lang: formData.language
			}).unwrap();

			saveBookingDraft(created.id, {
				date: formatDateToISO(formData.date),
				travellers_count: formData.travellers_count,
				option_id: formData.option_id,
				language: formData.language,
				tourId
			});

			router.replace(
				buildRoute(ENUM_PATH.TOURS.BOOKING_DRAFT, {
					tourId,
					bookingId: created.id
				})
			);
			hasSyncedPax.current = false;
			setCurrentStep(2);
		} catch {
			toast.error(
				bookingIdParam
					? "Failed to update booking"
					: "Failed to create booking"
			);
		}
	};

	const handlePrevStep = () => {
		setCurrentStep((prev) => Math.max(1, prev - 1));
	};

	const handleCalendarMonthChange = (month: Date) => {
		setCalendarRange(getPreviewCalendarRangeForMonth(month));
	};

	const handleAddTraveller = () => {
		const current =
			form.getValues(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS) ?? [];
		const count = form.getValues(
			ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT
		);

		if (current.length >= count) return;

		form.setValue(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS, [...current, {}]);
	};

	const handleRemoveTraveller = async (index: number) => {
		if (!bookingIdParam) return;

		const current =
			form.getValues(ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS) ?? [];
		const traveller = current[index] as ITravellerPaxInput | undefined;
		const paxId = traveller?.pax_id;

		try {
			if (paxId) {
				await deletePassengerInfo({
					bookingId: bookingIdParam,
					paxId
				}).unwrap();
			}

			form.setValue(
				ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS,
				current.filter((_, i) => i !== index)
			);
		} catch {
			toast.error("Failed to remove traveller");
		}
	};

	const onSubmit = async (formData: TPreviewBookingSchema) => {
		if (!bookingIdParam) return;

		try {
			for (const rawTraveller of formData.travellers) {
				const traveller = rawTraveller as ITravellerPaxInput;
				if (!isTravellerComplete(traveller)) continue;

				const file = getTravellerPassportFile(traveller);

				if (traveller.pax_id) {
					await updatePassengerInfo({
						bookingId: bookingIdParam,
						paxId: traveller.pax_id,
						data: mapTravellerToPaxUpdate(traveller)
					}).unwrap();

					if (file) {
						await uploadPassengerPassport({
							bookingId: bookingIdParam,
							paxId: traveller.pax_id,
							file
						}).unwrap();
					}
					continue;
				}

				const pax = await addPassengerInfo({
					id: bookingIdParam,
					data: mapTravellerToPaxCreate(traveller)
				}).unwrap();

				if (file) {
					await uploadPassengerPassport({
						bookingId: bookingIdParam,
						paxId: pax.id,
						file
					}).unwrap();
				}
			}

			const submitted = await submitBookingOrder(bookingIdParam).unwrap();
			setSubmittedBooking(submitted);
			setCurrentStep(3);
		} catch {
			toast.error("Failed to submit booking");
		}
	};

	const isLoading =
		isCreating ||
		isUpdating ||
		isAddingPax ||
		isUpdatingPax ||
		isDeletingPax ||
		isUploadingPassport ||
		isSubmitting;

	return {
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
		bookingId: bookingIdParam,
		submittedBooking,
		tourData,
		options,
		availableDates,
		availableLanguages,
		handleCalendarMonthChange,
		isTourLoading,
		isOptionsLoading,
		isOptionsError
	};
};
