export const parseLocalDateString = (value: string): Date => {
	const [year, month, day] = value.split("-").map(Number);

	return new Date(year, (month ?? 1) - 1, day ?? 1);
};

/** Date-only `YYYY-MM-DD` or legacy ISO datetime → local calendar Date. */
export const parseStoredLocalDate = (value: string): Date => {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return parseLocalDateString(value);
	}

	const parsed = new Date(value);
	return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};
