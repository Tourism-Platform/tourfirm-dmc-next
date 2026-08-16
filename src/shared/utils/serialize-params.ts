export function serializeParams(params: Record<string, unknown>): string {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			value.forEach((item) => searchParams.append(key, String(item)));
		} else {
			searchParams.set(key, String(value));
		}
	}

	return searchParams.toString();
}
