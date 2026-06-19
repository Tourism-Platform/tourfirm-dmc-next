import { getTranslations } from "next-intl/server";

import type { TMessageNamespace } from "@/shared/i18n";

import type { TLegalDocumentContentSection } from "../model";

import { LegalDocumentSection } from "./legal-document-section";

const paragraphClassName =
	"text-muted-foreground text-sm sm:text-base leading-relaxed";

type TLegalDocumentContentProps = {
	namespace: TMessageNamespace;
	sections: TLegalDocumentContentSection[];
};

export async function LegalDocumentContent({
	namespace,
	sections
}: TLegalDocumentContentProps) {
	const t = await getTranslations(namespace);

	return (
		<div className="flex flex-col gap-10 sm:gap-12">
			{sections.map((section) => (
				<LegalDocumentSection
					key={section.title}
					title={t(section.title as never)}
				>
					{section.type === "list" ? (
						<ul
							className={`${paragraphClassName} flex list-disc flex-col gap-2 pl-5`}
						>
							{section.items.map((itemKey) => (
								<li key={itemKey}>{t(itemKey as never)}</li>
							))}
						</ul>
					) : (
						<div className="flex flex-col gap-3">
							{section.paragraphs.map((paragraphKey) => (
								<p
									key={paragraphKey}
									className={paragraphClassName}
								>
									{t(paragraphKey as never)}
								</p>
							))}
						</div>
					)}
				</LegalDocumentSection>
			))}
		</div>
	);
}
