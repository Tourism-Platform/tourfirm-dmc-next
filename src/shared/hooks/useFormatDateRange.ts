import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { useLocale } from "next-intl";
import { type DateRange } from "react-day-picker";

const locales = {
	ru,
	en: enUS
};

type TFormatVariant = "short" | "long";

export const useFormatDateRange = () => {
	const locale = useLocale();

	const currentLocale = locales[locale as keyof typeof locales] || locales.en;

	const formatSingleDate = (date: Date, variant: TFormatVariant) => {
		if (variant === "short") {
			// Ожидаемый формат: "Thu, 20 march"
			const dayAndNumber = format(date, "EEE, d", {
				locale: currentLocale
			});
			const month = format(date, "MMMM", {
				locale: currentLocale
			}).toLowerCase();

			return `${dayAndNumber} ${month}`;
		}

		// Для варианта "long": "16 янв. 2026, 13:20 PM"
		const pattern = "d MMM. yyyy, HH:mm a";
		const formatted = format(date, pattern, { locale: currentLocale });

		return formatted.replace(/([A-Z][a-z]{2})/, (match) =>
			match.toLowerCase()
		);
	};

	/**
	 * Универсальная функция форматирования
	 * @param value - Одиночная дата или объект Range
	 * @param variant - 'short' (16 янв) или 'long' (16 янв. 2026, 13:20 PM)
	 */
	const formatDateRange = (
		value: DateRange | Date | undefined | null,
		variant: TFormatVariant = "short",
		placeholder = ""
	) => {
		if (!value) return placeholder;

		// Обработка одиночной даты
		if (value instanceof Date) {
			return formatSingleDate(value, variant);
		}

		// Обработка диапазона (Range)
		const { from, to } = value;
		if (!from) return placeholder;
		if (!to) return formatSingleDate(from, variant);

		return `${formatSingleDate(from, variant)} - ${formatSingleDate(to, variant)}`;
	};

	const formatDateTime = (date: string | Date | undefined): string => {
		if (!date) return "";
		const d = new Date(date);
		if (isNaN(d.getTime())) return String(date);

		// Format: "28 aug. 2025, 14:40 PM"
		// date-fns format: "d MMM. yyyy, HH:mm a"
		// we need lowercase month and specific dot usage
		const formatted = format(d, "d MMM. yyyy, HH:mm a", {
			locale: currentLocale
		});
		return formatted.replace(/([A-Z][a-z]{2})/, (match) =>
			match.toLowerCase()
		);
	};

	return { formatDateRange, formatDateTime };
};
