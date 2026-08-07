const getStorageKey = (bookingId: string): string =>
	`preview-booking-${bookingId}`;

export interface IBookingDraft {
	date: string;
	travellers_count: number;
	option_id: string;
	tourId: string;
}

export const saveBookingDraft = (
	bookingId: string,
	draft: IBookingDraft
): void => {
	sessionStorage.setItem(getStorageKey(bookingId), JSON.stringify(draft));
};

export const loadBookingDraft = (bookingId: string): IBookingDraft | null => {
	const raw = sessionStorage.getItem(getStorageKey(bookingId));
	if (!raw) return null;

	try {
		return JSON.parse(raw) as IBookingDraft;
	} catch {
		return null;
	}
};
