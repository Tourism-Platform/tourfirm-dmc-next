import { Suspense } from "react";

import { SuspenseLoader } from "@/shared/ui";

import { Search } from "@/widgets/search";

export function SearchPage() {
	return (
		<Suspense fallback={<SuspenseLoader />}>
			<Search />
		</Suspense>
	);
}
