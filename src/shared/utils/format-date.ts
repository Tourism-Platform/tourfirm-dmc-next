export const formatDate = (date: string | Date | undefined): string => {
	if (!date) return "";
	const d = new Date(date);
	if (isNaN(d.getTime())) return String(date);

	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();

	return `${day}/${month}/${year}`;
};

export const formatDateToISO = (date: string | Date | undefined): string => {
	if (!date) return "";
	const d = new Date(date);
	if (isNaN(d.getTime())) return String(date);

	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();

	return `${year}-${month}-${day}`;
};

export const fromatISOtoDate = (
	date: string | Date | undefined
): Date | undefined => {
	if (!date) return undefined;

	if (date instanceof Date) {
		return isNaN(date.getTime()) ? undefined : date;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		const [year, month, day] = date.split("-").map(Number);
		const local = new Date(year, (month ?? 1) - 1, day ?? 1);
		return isNaN(local.getTime()) ? undefined : local;
	}

	const d = new Date(date);
	if (isNaN(d.getTime())) return undefined;

	return d;
};
