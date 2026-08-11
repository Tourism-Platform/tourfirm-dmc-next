import type { BookingItineraryResponse } from "@/shared/api";

export type TBookingItineraryBackend = BookingItineraryResponse;

export type TBookingItineraryEventBackend =
	TBookingItineraryBackend["events"][number];
