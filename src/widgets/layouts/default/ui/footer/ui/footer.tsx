import type {
	TResolvedFooterColumn,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";
import { Separator } from "@/shared/ui";
import type { TUiFooter } from "@/shared/ui-content";

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
	const rowOne = columns.slice(0, 4);
	const rowTwo = columns.slice(4, 8);
	const trailingColumns = columns.slice(8);
	const communityTitle = uiTexts.community?.title?.trim();
	const communitySubtitle = uiTexts.community?.subtitle?.trim();
	const tagline = uiTexts.brand.tagline?.trim();
	const hasCommunity = Boolean(communityTitle || communitySubtitle);

	return (
		<footer className="border-t bg-card/80 text-foreground backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-6">
					<FooterLogo
						brandName={uiTexts.brand.name}
						tagline={tagline}
					/>
				</div>

				{rowOne.length > 0 ? (
					<div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
						{rowOne.map((section) => (
							<FooterSection
								key={section.key}
								title={section.title}
								links={section.links}
								comingSoonLabel={uiTexts.comingSoon}
							/>
						))}
					</div>
				) : null}

				{rowTwo.length > 0 ? (
					<div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
						{rowTwo.map((section) => (
							<FooterSection
								key={section.key}
								title={section.title}
								links={section.links}
								comingSoonLabel={uiTexts.comingSoon}
							/>
						))}
					</div>
				) : null}

				{(trailingColumns.length > 0 || hasCommunity) && (
					<div className="grid grid-cols-2 items-end gap-x-10 gap-y-10 md:grid-cols-4">
						{trailingColumns.map((section) => (
							<FooterSection
								key={section.key}
								title={section.title}
								links={section.links}
								comingSoonLabel={uiTexts.comingSoon}
							/>
						))}
						{hasCommunity ? (
							<div className="flex max-w-md flex-col gap-2 self-end text-left md:col-start-4">
								{communityTitle ? (
									<p className="font-serif text-xl font-normal italic tracking-tight text-foreground sm:text-2xl">
										{communityTitle}
									</p>
								) : null}
								{communitySubtitle ? (
									<p className="font-[family-name:var(--font-kurier)] text-lg italic leading-snug text-foreground/75 sm:text-xl">
										{communitySubtitle}
									</p>
								) : null}
							</div>
						) : null}
					</div>
				)}

				<Separator />

				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<FooterCopyright
						text={
							copyrightText
								? copyrightText.replace("{year}", String(year))
								: uiTexts.copyright.replace(
										"{year}",
										String(year)
									)
						}
					/>
					{socialLinks.length > 0 ? (
						<FooterSocial items={socialLinks} />
					) : null}
				</div>
			</div>
		</footer>
	);
};
