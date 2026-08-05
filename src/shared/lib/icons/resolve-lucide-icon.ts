import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

function toPascalCase(value: string): string {
	return value
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

export function resolveLucideIcon(name?: string): LucideIcon | null {
	if (!name?.trim()) {
		return null;
	}

	const key = toPascalCase(name.trim());
	const icons = LucideIcons as unknown as Record<
		string,
		LucideIcon | undefined
	>;

	return icons[key] ?? null;
}
