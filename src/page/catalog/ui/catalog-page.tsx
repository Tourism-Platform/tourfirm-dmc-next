"use client";

import { Suspense } from "react";

import { SuspenseLoader } from "@/shared/ui";

import { CatalogTours } from "@/widgets/catalog";

export function CatalogPage() {
	return (
		<Suspense fallback={<SuspenseLoader />}>
			<CatalogTours />
		</Suspense>
	);
}
