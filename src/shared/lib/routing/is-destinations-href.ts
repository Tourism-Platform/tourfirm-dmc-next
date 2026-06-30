function normalizePath(href: string): string {
	const trimmed = href.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

	return withSlash.replace(/\/+$/, "") || "/";
}

export function isDestinationsHref(
	href: string | undefined,
	destinationSlug: string
): boolean {
	if (!href?.trim() || !destinationSlug.trim()) {
		return false;
	}

	return normalizePath(href) === normalizePath(`/${destinationSlug}`);
}
