"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { TOptionsKeys } from "@/shared/i18n/i18n.config";
import type { Option, SelectPickerOption } from "@/shared/ui";

export const valueToLabel = <T extends Record<string, string>>(
	labels: T
): SelectPickerOption[] =>
	Object.entries(labels).map(([value, label]) => ({
		label,
		value
	}));

export const useValueToTranslateLabel = (
	labels: Partial<Record<string, string>>
): Option[] => {
	const t = useTranslations("options");

	return useMemo(
		() =>
			Object.entries(labels)
				.filter((entry): entry is [string, string] => Boolean(entry[1]))
				.map(([value, label]) => ({
					label: t(label as TOptionsKeys),
					value
				})),
		[labels, t]
	);
};
