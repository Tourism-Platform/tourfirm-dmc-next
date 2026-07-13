import type {
	TResolvedFooterColumn,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";
import { Separator } from "@/shared/ui";
import type { TUiFooter } from "@/shared/ui-content";

import { FooterContact } from "./footer-contact";
import { FooterCopyright } from "./footer-copyright";
import { FooterLogo } from "./footer-logo";
import { FooterSection } from "./footer-section";
import { FooterSocial } from "./footer-social";

type TProps = {
	columns: TResolvedFooterColumn[];
	socialLinks: TResolvedSocialLink[];
	copyrightText?: string;
	uiTexts: TUiFooter;
};

export const FooterDefault = async ({
	columns,
	socialLinks,
	copyrightText,
	uiTexts
}: TProps) => {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t bg-card/75 px-4 text-foreground shadow-black/6.5 backdrop-blur-xl">
			<div className="mx-auto max-w-7xl px-4 py-10 lg:px-4 xl:px-8">
				<div className="flex flex-col gap-8">
					<div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
						<div className="col-span-2 flex flex-col gap-4 md:col-span-4 lg:col-span-1">
							<FooterLogo brandName={uiTexts.brand.name} />
							<FooterContact />
						</div>

						{columns.map((section) => (
							<FooterSection
								key={section.key}
								title={section.title}
								links={section.links}
								comingSoonLabel={uiTexts.comingSoon}
							/>
						))}
					</div>

					<Separator />

					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<FooterCopyright
							text={
								copyrightText
									? copyrightText.replace(
											"{year}",
											String(year)
										)
									: uiTexts.copyright.replace(
											"{year}",
											String(year)
										)
							}
						/>
						<FooterSocial items={socialLinks} />
					</div>
				</div>
			</div>
		</footer>
	);
};
