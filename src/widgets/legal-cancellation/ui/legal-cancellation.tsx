import { LEGAL_HERO_IMAGE, LegalDocument } from "@/widgets/legal-document";

import { CANCELLATION_CONTENT_SECTIONS } from "../model";

export function LegalCancellation() {
	return (
		<LegalDocument
			namespace="legal_cancellation_page"
			imageSrc={LEGAL_HERO_IMAGE}
			sections={CANCELLATION_CONTENT_SECTIONS}
		/>
	);
}
