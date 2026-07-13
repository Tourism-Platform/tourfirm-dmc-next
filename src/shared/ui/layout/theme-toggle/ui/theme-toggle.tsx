"use client";

import { Moon, Sun } from "lucide-react";
import type { FC } from "react";

import { Button } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { useTheme } from "../model";

export const ThemeToggle: FC = () => {
	const { theme, toggleTheme } = useTheme();
	const { common } = useUiContent();
	const themeLabel =
		theme === "dark" ? common.themeToggle.dark : common.themeToggle.light;

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={toggleTheme}
			className="cursor-pointer hover:bg-primary/10"
			aria-label={themeLabel}
			title={themeLabel}
		>
			{theme === "light" ? (
				<Moon className="h-4 w-4" />
			) : (
				<Sun className="h-4 w-4" />
			)}
		</Button>
	);
};
