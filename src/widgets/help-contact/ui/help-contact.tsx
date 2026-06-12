import { ContactEmailsSection } from "./contact-emails-section";
import { ContactHero } from "./contact-hero";
import { ContactLegalSection } from "./contact-legal-section";
import { ContactOfficeSection } from "./contact-office-section";
import { ContactPrimarySection } from "./contact-primary-section";

export function HelpContact() {
	return (
		<div className="flex flex-col">
			<ContactHero />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				<ContactPrimarySection />
				<ContactEmailsSection />
				<ContactOfficeSection />
				<ContactLegalSection />
			</div>
		</div>
	);
}
