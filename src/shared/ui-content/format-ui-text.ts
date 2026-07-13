type TFormatValues = Record<string, string | number>;

export function createNestedTextResolver(
	root: Record<string, unknown>
): (path: string, values?: TFormatValues) => string {
	return (path: string, values?: TFormatValues) => {
		const resolved = path.split(".").reduce<unknown>((acc, key) => {
			if (acc && typeof acc === "object" && key in acc) {
				return (acc as Record<string, unknown>)[key];
			}

			return undefined;
		}, root);

		if (typeof resolved !== "string") {
			return path;
		}

		return formatUiText(resolved, values);
	};
}

export function formatUiText(template: string, values?: TFormatValues): string {
	if (!values) {
		return template;
	}

	return template.replace(/\{\{?(\w+)\}?\}/g, (match, key: string) => {
		const value = values[key];

		if (value === undefined || value === null) {
			return match;
		}

		return String(value);
	});
}

export function formatPluralUiText(
	template: string,
	count: number,
	values?: TFormatValues
): string {
	const icuMatch = template.match(
		/\{count,\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\}/
	);

	if (icuMatch) {
		const [, oneForm, otherForm] = icuMatch;
		const form = count === 1 ? oneForm : otherForm;
		const resolved = form.replace(/#/g, String(count));

		return formatUiText(resolved, { ...values, count });
	}

	return formatUiText(template, { ...values, count });
}
