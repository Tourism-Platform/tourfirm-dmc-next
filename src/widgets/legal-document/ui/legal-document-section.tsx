import type { ReactNode } from "react";

type TLegalDocumentSectionProps = {
	title: string;
	children: ReactNode;
};

export function LegalDocumentSection({
	title,
	children
}: TLegalDocumentSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
			{children}
		</section>
	);
}
