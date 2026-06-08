"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Button } from "@/shared/ui";

import { useTheme } from "../model";

export const ThemeToggle: FC = () => {
	const { theme, toggleTheme } = useTheme();
	const t = useTranslations("common.themeToggle");
	const themeLabel = theme === "dark" ? t("dark") : t("light");

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
