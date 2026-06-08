import { getTranslations } from "next-intl/server";

export async function MainPage() {
	const t = await getTranslations("main_page");

	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
			<h1 className="max-w-lg text-3xl font-semibold tracking-tight">
				{t("title")}
			</h1>
			<p className="max-w-md text-lg text-muted-foreground">
				{t("description")}
			</p>
		</main>
	);
}
