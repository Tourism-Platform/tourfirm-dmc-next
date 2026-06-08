import { setRequestLocale } from "next-intl/server";

import { CompanyFeedbackPage } from "@/page/company-feedback";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function FeedbackRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyFeedbackPage />;
}
