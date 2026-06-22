import { AboutConnectionSection } from "./about-connection-section";
import { AboutCtaSection } from "./about-cta-section";
import { AboutDevelopmentSection } from "./about-development-section";
import { AboutHero } from "./about-hero";
import { AboutIntroSection } from "./about-intro-section";
import { AboutMissionSection } from "./about-mission-section";
import { AboutTeamSection } from "./about-team-section";
import { AboutValuesSection } from "./about-values-section";

export function CompanyAbout() {
	return (
		<div className="flex flex-col">
			<AboutHero />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				<AboutIntroSection />
				<AboutMissionSection />
				<AboutValuesSection />
				<AboutTeamSection />
				<AboutDevelopmentSection />
				<AboutConnectionSection />
				<AboutCtaSection />
			</div>
		</div>
	);
}
