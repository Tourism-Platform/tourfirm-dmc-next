"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ENV } from "@/shared/config";

type TWithMswProps = {
	children: ReactNode;
};

export function WithMsw({ children }: TWithMswProps) {
	const [isReady, setIsReady] = useState(!ENV.API_MOCKING);

	useEffect(() => {
		if (!ENV.API_MOCKING) return;

		const initMsw = async () => {
			try {
				const { worker } = await import("@/app/init/msw");
				await worker.start({ onUnhandledRequest: "bypass" });
			} catch (error) {
				console.error("[MSW] Failed to start worker:", error);
			} finally {
				setIsReady(true);
			}
		};

		void initMsw();
	}, []);

	if (!isReady) return null;

	return children;
}
