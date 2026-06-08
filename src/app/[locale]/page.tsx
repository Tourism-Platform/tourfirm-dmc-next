import { getTranslations, setRequestLocale } from "next-intl/server";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("common");

	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
			<h1 className="max-w-lg text-3xl font-semibold tracking-tight">
				{t("home.title")}
			</h1>
			<p className="max-w-md text-lg text-muted-foreground">
				{t("home.description")}
			</p>
		</main>
	);
}
