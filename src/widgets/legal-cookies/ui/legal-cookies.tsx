import { LEGAL_HERO_IMAGE, LegalDocument } from "@/widgets/legal-document";

import { COOKIES_CONTENT_SECTIONS } from "../model";

export function LegalCookies() {
	return (
		<LegalDocument
			namespace="legal_cookies_page"
			imageSrc={LEGAL_HERO_IMAGE}
			sections={COOKIES_CONTENT_SECTIONS}
		/>
	);
}
