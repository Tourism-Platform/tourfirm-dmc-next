import type { ReactNode } from "react";

import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";

type TProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	children: ReactNode;
};

export function DiscoveryRelatedSection({
	eyebrow,
	title,
	description,
	children
}: TProps) {
	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={eyebrow}
				title={title}
				description={description}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{children}
			</div>
		</section>
	);
}
