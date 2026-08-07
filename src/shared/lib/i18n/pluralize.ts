export type TPluralForms = {
	one: string;
	few: string;
	many: string;
	other: string;
};

export type TPluralFormKey = keyof TPluralForms;

export function pickPluralFormKey(
	count: number,
	locale: string
): TPluralFormKey {
	if (locale === "ru") {
		const mod10 = count % 10;
		const mod100 = count % 100;

		if (mod10 === 1 && mod100 !== 11) {
			return "one";
		}

		if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
			return "few";
		}

		return "many";
	}

	return count === 1 ? "one" : "other";
}

export function pickPluralTemplate(
	count: number,
	locale: string,
	forms: TPluralForms
): string {
	const key = pickPluralFormKey(count, locale);
	return forms[key] ?? forms.other;
}

export function interpolateTemplate(
	template: string,
	vars: Record<string, string | number>
): string {
	return Object.entries(vars).reduce(
		(acc, [key, value]) =>
			acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value)),
		template
	);
}

export function formatPluralCount(
	count: number,
	locale: string,
	forms: TPluralForms
): string {
	return interpolateTemplate(pickPluralTemplate(count, locale, forms), {
		count
	});
}
