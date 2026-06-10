import { ENUM_PATH } from "@/shared/config";
import { redirect } from "@/shared/i18n/navigation";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function HowWeWorkRedirectRoute({ params }: TProps) {
	const { locale } = await params;

	redirect({
		href: ENUM_PATH.COMPANY.SERVICES,
		locale
	});
}
