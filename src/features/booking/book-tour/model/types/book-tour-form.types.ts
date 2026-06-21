import type { TBookingTourModalKeys } from "@/shared/i18n";
import type { TFormField } from "@/shared/types";

import type { TBookTourForm } from "../schema/book-tour.schema";

export type TBookTourFieldKey = Exclude<
	keyof TBookTourForm,
	"tourId" | "tourTitle"
>;

export type TBookTourFormField = TFormField<
	TBookingTourModalKeys,
	TBookTourFieldKey
>;
