"use client";

import NextTopLoader from "nextjs-toploader";

export function WithTopLoader() {
	return (
		<NextTopLoader
			color={"var(--primary)"}
			height={4}
			showSpinner={false}
			speed={200}
			shadow={`0 0 10px var(--primary), 0 0 5px var(--primary)`}
		/>
	);
}
