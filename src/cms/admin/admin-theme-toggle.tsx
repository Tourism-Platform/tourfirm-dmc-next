"use client";

import { Button, useTheme } from "@payloadcms/ui";
import { Moon, Sun } from "lucide-react";

export function AdminThemeToggle() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<Button
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			buttonStyle="secondary"
			className="min-w-8 px-2"
			icon={
				isDark ? (
					<Sun className="size-4" />
				) : (
					<Moon className="size-4" />
				)
			}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			size="small"
			type="button"
		/>
	);
}
