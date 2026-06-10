import { ServicesBusinessSection } from "./services-business-section";
import { ServicesCtaSection } from "./services-cta-section";
import { ServicesDirectionsSection } from "./services-directions-section";
import { ServicesHero } from "./services-hero";
import { ServicesPhilosophySection } from "./services-philosophy-section";
import { ServicesProcessSection } from "./services-process-section";

export function CompanyServices() {
	return (
		<div className="flex flex-col">
			<ServicesHero />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				<ServicesDirectionsSection />
				<ServicesProcessSection />
				<ServicesPhilosophySection />
				<ServicesBusinessSection />
				<ServicesCtaSection />
			</div>
		</div>
	);
}
