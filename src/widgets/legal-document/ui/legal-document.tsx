import type { TMessageNamespace } from "@/shared/i18n";

import type { TLegalDocumentContentSection } from "../model";

import { LegalDocumentContent } from "./legal-document-content";
import { LegalDocumentHero } from "./legal-document-hero";

type TLegalDocumentProps = {
	namespace: TMessageNamespace;
	imageSrc: string;
	sections: TLegalDocumentContentSection[];
};

export function LegalDocument({
	namespace,
	imageSrc,
	sections
}: TLegalDocumentProps) {
	return (
		<div className="flex flex-col">
			<LegalDocumentHero namespace={namespace} imageSrc={imageSrc} />
			<div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<LegalDocumentContent
					namespace={namespace}
					sections={sections}
				/>
			</div>
		</div>
	);
}
