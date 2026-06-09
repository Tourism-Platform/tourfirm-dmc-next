import { getTranslations } from "next-intl/server";

import type { TQueryParams } from "@/shared/config";
import { ENUM_PATH } from "@/shared/config";

type TCatalogSearch = TQueryParams[typeof ENUM_PATH.MAIN.CATALOG];

type TCatalogPageProps = {
	search?: TCatalogSearch;
};

export async function CatalogPage({ search }: TCatalogPageProps) {
	const t = await getTranslations("catalog_page");
	const hasSearch = Boolean(
		search?.destination || search?.checkIn || search?.checkOut
	);

	return (
		<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-2 text-center sm:text-left">
				<h1 className="text-3xl font-semibold tracking-tight">
					{t("title")}
				</h1>
				<p className="text-muted-foreground text-lg">
					{t("description")}
				</p>
			</div>

			<section className="bg-card rounded-xl border p-6">
				<h2 className="mb-4 text-lg font-semibold">
					{t("search.title")}
				</h2>
				{hasSearch ? (
					<dl className="grid gap-3 sm:grid-cols-3">
						{search?.destination && (
							<div>
								<dt className="text-muted-foreground text-sm">
									{t("search.destination")}
								</dt>
								<dd className="font-medium">
									{search.destination}
								</dd>
							</div>
						)}
						{search?.checkIn && (
							<div>
								<dt className="text-muted-foreground text-sm">
									{t("search.check_in")}
								</dt>
								<dd className="font-medium">
									{search.checkIn}
								</dd>
							</div>
						)}
						{search?.checkOut && (
							<div>
								<dt className="text-muted-foreground text-sm">
									{t("search.check_out")}
								</dt>
								<dd className="font-medium">
									{search.checkOut}
								</dd>
							</div>
						)}
					</dl>
				) : (
					<p className="text-muted-foreground text-sm">
						{t("search.empty")}
					</p>
				)}
			</section>
		</main>
	);
}
