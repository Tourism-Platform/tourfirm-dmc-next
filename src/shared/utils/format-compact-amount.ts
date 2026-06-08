import Decimal from "decimal.js";

const COMPACT_THRESHOLD_K = 100_000;
const COMPACT_THRESHOLD_MLN = 1_000_000;
const FRACTION_DIGITS = 2;

const plainFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: FRACTION_DIGITS,
	maximumFractionDigits: FRACTION_DIGITS
});

export const parseDecimalSafe = (value: string | number): Decimal => {
	try {
		const decimal = new Decimal(value ?? 0);

		if (!decimal.isFinite()) {
			return new Decimal(0);
		}

		return decimal;
	} catch {
		return new Decimal(0);
	}
};

const formatPlainDecimal = (decimal: Decimal): string =>
	plainFormatter.format(
		decimal
			.toDecimalPlaces(FRACTION_DIGITS, Decimal.ROUND_HALF_UP)
			.toNumber()
	);

const formatScaled = (
	value: Decimal,
	divisor: number,
	suffix: string
): string => {
	const scaled = value
		.div(divisor)
		.toDecimalPlaces(FRACTION_DIGITS, Decimal.ROUND_HALF_UP);

	return `${formatPlainDecimal(scaled)} ${suffix}`;
};

export const formatCompactAmount = (value: string | number): string => {
	const decimal = parseDecimalSafe(value);
	const abs = decimal.abs();

	if (abs.lt(COMPACT_THRESHOLD_K)) {
		return formatPlainDecimal(decimal);
	}

	if (abs.gte(COMPACT_THRESHOLD_MLN)) {
		return formatScaled(decimal, COMPACT_THRESHOLD_MLN, "mln");
	}

	return formatScaled(decimal, COMPACT_THRESHOLD_K, "K");
};

export const isDecimalRangeZero = (min: string, max: string): boolean =>
	parseDecimalSafe(min).isZero() && parseDecimalSafe(max).isZero();

export const isDecimalRangeEqual = (min: string, max: string): boolean =>
	parseDecimalSafe(min).equals(parseDecimalSafe(max));
