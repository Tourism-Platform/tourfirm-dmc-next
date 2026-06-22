"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ENV } from "@/shared/config";

type TWithMswProps = {
	children: ReactNode;
};

let workerStartPromise: Promise<void> | null = null;

const startMswWorker = async () => {
	if (workerStartPromise) {
		return workerStartPromise;
	}

	workerStartPromise = (async () => {
		const { worker } = await import("@/app/init/msw");
		await worker.start({
			onUnhandledRequest: "bypass",
			quiet: true,
			serviceWorker: {
				url: "/mockServiceWorker.js"
			}
		});
	})();

	return workerStartPromise;
};

export function WithMsw({ children }: TWithMswProps) {
	const [isReady, setIsReady] = useState(!ENV.API_MOCKING);

	useEffect(() => {
		if (!ENV.API_MOCKING) return;

		const initMsw = async () => {
			try {
				await startMswWorker();
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
