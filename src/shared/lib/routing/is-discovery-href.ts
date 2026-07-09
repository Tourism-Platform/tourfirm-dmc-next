function normalizePath(href: string): string {
	const trimmed = href.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

	return withSlash.replace(/\/+$/, "") || "/";
}

export function isRoutesHref(href: string | undefined): boolean {
	if (!href?.trim()) {
		return false;
	}

	return normalizePath(href) === "/routes";
}

export function isExperiencesHref(href: string | undefined): boolean {
	if (!href?.trim()) {
		return false;
	}

	return normalizePath(href) === "/experiences";
}
