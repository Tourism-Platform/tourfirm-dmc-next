import { PrivacyContent } from "./privacy-content";
import { PrivacyHero } from "./privacy-hero";

export function LegalPrivacy() {
	return (
		<div className="flex flex-col">
			<PrivacyHero />
			<div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<PrivacyContent />
			</div>
		</div>
	);
}
