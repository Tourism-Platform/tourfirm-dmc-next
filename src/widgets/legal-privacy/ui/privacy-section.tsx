import type { ReactNode } from "react";

type TPrivacySectionProps = {
	title: string;
	children: ReactNode;
};

export function PrivacySection({ title, children }: TPrivacySectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
			{children}
		</section>
	);
}
