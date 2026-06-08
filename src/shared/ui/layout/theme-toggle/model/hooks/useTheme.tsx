"use client";

import { useTheme as useNextThemes } from "next-themes";
import { useSyncExternalStore } from "react";

import type { IThemeContextType } from "../types";

const emptySubscribe = () => () => {};

export const useTheme = (): IThemeContextType => {
	const { resolvedTheme, setTheme } = useNextThemes();
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);

	const theme = (
		mounted ? (resolvedTheme ?? "light") : "light"
	) as IThemeContextType["theme"];

	return {
		theme,
		toggleTheme: () => setTheme(theme === "light" ? "dark" : "light")
	};
};
