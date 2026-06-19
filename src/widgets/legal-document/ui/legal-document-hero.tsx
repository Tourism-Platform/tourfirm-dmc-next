import { getTranslations } from "next-intl/server";

import type { TMessageNamespace } from "@/shared/i18n";
import { CustomPageHero } from "@/shared/ui";

type TLegalDocumentHeroProps = {
	namespace: TMessageNamespace;
	imageSrc: string;
};

export async function LegalDocumentHero({
	namespace,
	imageSrc
}: TLegalDocumentHeroProps) {
	const t = await getTranslations(namespace);

	return (
		<CustomPageHero
			imageSrc={imageSrc}
			imageAlt={t("hero.title")}
			title={t("hero.title")}
			description={t("hero.description")}
		/>
	);
}
