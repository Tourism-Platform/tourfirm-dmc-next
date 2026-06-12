import { getTranslations } from "next-intl/server";

import { PRIVACY_CONTENT_SECTIONS } from "../model";

import { PrivacySection } from "./privacy-section";

const paragraphClassName =
	"text-muted-foreground text-sm sm:text-base leading-relaxed";

export async function PrivacyContent() {
	const t = await getTranslations("legal_privacy_page");

	return (
		<div className="flex flex-col gap-10 sm:gap-12">
			{PRIVACY_CONTENT_SECTIONS.map((section) => (
				<PrivacySection key={section.title} title={t(section.title)}>
					{section.type === "list" ? (
						<ul
							className={`${paragraphClassName} flex list-disc flex-col gap-2 pl-5`}
						>
							{section.items.map((itemKey) => (
								<li key={itemKey}>{t(itemKey)}</li>
							))}
						</ul>
					) : (
						<div className="flex flex-col gap-3">
							{section.paragraphs.map((paragraphKey) => (
								<p
									key={paragraphKey}
									className={paragraphClassName}
								>
									{t(paragraphKey)}
								</p>
							))}
						</div>
					)}
				</PrivacySection>
			))}
		</div>
	);
}
