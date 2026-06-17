import * as Icons from "lucide-react";
import { HelpCircle, type LucideIcon } from "lucide-react";

function toPascalCase(str: string): string {
	return str
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
		.replace(/^(.)/, (c) => c.toUpperCase());
}

export function getLucideIcon(
	name?: string | LucideIcon | null,
	fallback: LucideIcon = HelpCircle
): LucideIcon {
	if (!name) return fallback;

	if (typeof name !== "string") {
		return name;
	}

	const pascalName = toPascalCase(name);
	const Icon = (Icons as unknown as Record<string, LucideIcon>)[pascalName];

	return Icon ?? fallback;
}
