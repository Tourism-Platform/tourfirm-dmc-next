import { LegalDocument } from "@/widgets/legal-document";

import { PRIVACY_CONTENT_SECTIONS, PRIVACY_HERO_IMAGE } from "../model";

export function LegalPrivacy() {
	return (
		<LegalDocument
			namespace="legal_privacy_page"
			imageSrc={PRIVACY_HERO_IMAGE}
			sections={PRIVACY_CONTENT_SECTIONS}
		/>
	);
}
