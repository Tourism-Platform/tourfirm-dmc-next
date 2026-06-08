"use client";

import { LanguageToggle, ThemeToggle } from "@/shared/ui";

export function HomeHeader() {
	return (
		<header className="flex w-full items-center justify-end gap-3 p-4">
			<LanguageToggle />
			<ThemeToggle />
		</header>
	);
}
