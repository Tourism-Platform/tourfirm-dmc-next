import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { createPageMetadata } from "@/shared/lib/seo";

import { TeamProfilePreviewPage } from "@/page/team-profile-preview";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;

	return {
		...createPageMetadata({
			title: "О нас | preview",
			description:
				"Черновик страницы компании: блоки и карточки команды до переноса в Payload.",
			locale,
			path: "/preview/team-profile"
		}),
		robots: { index: false, follow: false }
	};
}

export default async function TeamProfilePreviewRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <TeamProfilePreviewPage />;
}
