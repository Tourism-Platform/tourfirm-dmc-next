"use client";

import { type ReactNode, createContext, useContext } from "react";

import type { TUiContent } from "./ui-content.types";

const UiContentContext = createContext<TUiContent | null>(null);

type TProps = {
	value: TUiContent;
	children: ReactNode;
};

export function UiContentProvider({ value, children }: TProps) {
	return (
		<UiContentContext.Provider value={value}>
			{children}
		</UiContentContext.Provider>
	);
}

export function useUiContent(): TUiContent {
	const context = useContext(UiContentContext);

	if (!context) {
		throw new Error("useUiContent must be used within UiContentProvider");
	}

	return context;
}
