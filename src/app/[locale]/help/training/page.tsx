import { setRequestLocale } from "next-intl/server";

import { HelpTrainingPage } from "@/page/help-training";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function TrainingRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpTrainingPage />;
}
