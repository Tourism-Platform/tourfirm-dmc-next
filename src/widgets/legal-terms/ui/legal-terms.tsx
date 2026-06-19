import { LEGAL_HERO_IMAGE, LegalDocument } from "@/widgets/legal-document";

import { TERMS_CONTENT_SECTIONS } from "../model";

export function LegalTerms() {
	return (
		<LegalDocument
			namespace="legal_terms_page"
			imageSrc={LEGAL_HERO_IMAGE}
			sections={TERMS_CONTENT_SECTIONS}
		/>
	);
}
