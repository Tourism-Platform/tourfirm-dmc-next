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

	return d.toISOString().split("T")[0];
};

export const fromatISOtoDate = (
	date: string | Date | undefined
): Date | undefined => {
	if (!date) return undefined;

	const d = new Date(date);
	if (isNaN(d.getTime())) return undefined;

	return d;
};
