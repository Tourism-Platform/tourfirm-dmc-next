import { LEGAL_HERO_IMAGE, LegalDocument } from "@/widgets/legal-document";

import { BOOKING_CONTENT_SECTIONS } from "../model";

export function LegalBooking() {
	return (
		<LegalDocument
			namespace="legal_booking_page"
			imageSrc={LEGAL_HERO_IMAGE}
			sections={BOOKING_CONTENT_SECTIONS}
		/>
	);
}
