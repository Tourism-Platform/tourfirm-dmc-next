import { getTranslations } from "next-intl/server";

import { Separator } from "@/shared/ui";

import { FOOTER_SECTIONS, SOCIAL_LINKS } from "../model";

import { FooterContact } from "./footer-contact";
import { FooterCopyright } from "./footer-copyright";
import { FooterLogo } from "./footer-logo";
import { FooterSection } from "./footer-section";
import { FooterSocial } from "./footer-social";

export const FooterDefault = async () => {
	const t = await getTranslations("footer");
	const year = new Date().getFullYear();

	const sections = FOOTER_SECTIONS.map((section) => ({
		title: t(section.title),
		links: section.links.map((link) => ({
			label: t(link.label),
			path: link.path,
			isSoon: link.isSoon
		}))
	}));

	const socialItems = SOCIAL_LINKS.map((item) => ({
		name: item.name,
		label: t(item.label),
		path: item.path
	}));

	return (
		<footer className="border-t bg-card/75 px-4 text-foreground shadow-black/6.5 backdrop-blur-xl">
			<div className="mx-auto max-w-7xl px-4 py-10 lg:px-4 xl:px-8">
				<div className="flex flex-col gap-8">
					<div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
						<div className="col-span-2 flex flex-col gap-4 md:col-span-4 lg:col-span-1">
							<FooterLogo brandName={t("brand.name")} />
							<FooterContact />
						</div>

						{sections.map((section) => (
							<FooterSection
								key={section.title}
								title={section.title}
								links={section.links}
								comingSoonLabel={t("coming_soon")}
							/>
						))}
					</div>

					<Separator />

					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<FooterCopyright text={t("copyright", { year })} />
						<FooterSocial items={socialItems} />
					</div>
				</div>
			</div>
		</footer>
	);
};
