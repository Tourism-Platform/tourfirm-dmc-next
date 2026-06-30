import { HelpCircle, type LucideIcon, icons } from "lucide-react";

/** Lucide export keys are PascalCase, e.g. MapPin, AlarmClock. */
export function toPascalCase(str: string): string {
	return str
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
		.replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Resolves a CMS/YAML icon string to a Lucide `icons` map key.
 * Accepts PascalCase (`Compass`), kebab-case (`map-pin`), snake_case (`map_pin`), lowercase (`compass`).
 */
export function resolveLucideIconKey(name: string): keyof typeof icons | null {
	const trimmed = name.trim();

	if (!trimmed) {
		return null;
	}

	if (trimmed in icons) {
		return trimmed as keyof typeof icons;
	}

	const pascalName = toPascalCase(trimmed);

	if (pascalName in icons) {
		return pascalName as keyof typeof icons;
	}

	return null;
}

/** @deprecated Use resolveLucideIconKey */
export function normalizeLucideIconName(
	name: string
): keyof typeof icons | null {
	return resolveLucideIconKey(name);
}

export function getLucideIcon(
	name?: string | LucideIcon | null,
	fallback: LucideIcon = HelpCircle
): LucideIcon {
	if (!name) {
		return fallback;
	}

	if (typeof name !== "string") {
		return name;
	}

	const iconKey = resolveLucideIconKey(name);

	return iconKey ? icons[iconKey] : fallback;
}
