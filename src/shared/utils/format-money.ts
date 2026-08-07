type TFormatMoneyOptions = {
	currency?: string | null;
	compact?: boolean;
};

const DEFAULT_CURRENCY = "USD";

export const formatMoney = (
	value: string | number,
	options: TFormatMoneyOptions = {}
): string => {
	const numValue = typeof value === "string" ? parseFloat(value) : value;
	const amount = Number.isFinite(numValue) ? numValue : 0;
	const currency = options.currency || DEFAULT_CURRENCY;
	const useCompact = options.compact ?? Math.abs(amount) >= 100_000;

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		notation: useCompact ? "compact" : "standard",
		maximumFractionDigits: currency === "UZS" ? (useCompact ? 1 : 0) : 2,
		minimumFractionDigits: 0
	}).format(amount);
};
