"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "@/shared/lib/store";

type TWithStoreProps = {
	children: ReactNode;
};

export function WithStore({ children }: TWithStoreProps) {
	return <Provider store={store}>{children}</Provider>;
}
