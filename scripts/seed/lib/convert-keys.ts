export function toCamelCase(key: string): string {
	return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function convertKeysDeep<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => convertKeysDeep(item)) as T;
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, nested]) => [
				toCamelCase(key),
				convertKeysDeep(nested)
			])
		) as T;
	}

	return value;
}
