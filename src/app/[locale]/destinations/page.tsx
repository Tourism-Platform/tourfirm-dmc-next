import { setRequestLocale } from "next-intl/server";

import { DestinationsPage } from "@/page/destinations";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function DestinationsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <DestinationsPage />;
}
