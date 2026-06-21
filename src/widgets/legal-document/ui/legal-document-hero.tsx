import { format } from "date-fns";
import { getTranslations } from "next-intl/server";

import type { TMessageNamespace } from "@/shared/i18n";
import { Badge, CustomPageHero } from "@/shared/ui";

import { LEGAL_DOCUMENT_UPDATED_AT } from "../model";

type TLegalDocumentHeroProps = {
	namespace: TMessageNamespace;
	imageSrc: string;
};

export async function LegalDocumentHero({
	namespace,
	imageSrc
}: TLegalDocumentHeroProps) {
	const t = await getTranslations(namespace);
	const formattedDate = format(LEGAL_DOCUMENT_UPDATED_AT, "dd.MM.yyyy");

	const heroActions = (
		<Badge
			variant="secondary"
			className="border-white/20 bg-white/10 text-white"
		>
			{t("hero.updated_at", { date: formattedDate })}
		</Badge>
	);

	return (
		<CustomPageHero
			imageSrc={imageSrc}
			imageAlt={t("hero.title")}
			title={t("hero.title")}
			description={t("hero.description")}
			actions={heroActions}
		/>
	);
}
