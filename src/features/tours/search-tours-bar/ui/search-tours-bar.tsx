"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { useMemo } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { useRouter } from "@/shared/i18n";
import {
	Button,
	Card,
	CardContent,
	CustomField,
	Form,
	Separator
} from "@/shared/ui";

import {
	type TSearchTours,
	mapSearchToursToCatalogQuery,
	searchToursSchema,
	useGetCatalogDestinationsQuery
} from "@/entities/tour";

interface ISearchToursBarProps {
	form?: UseFormReturn<TSearchTours>;
	className?: string;
}

export const SearchToursBar: FC<ISearchToursBarProps> = ({
	form: externalForm,
	className
}) => {
	const t = useTranslations("catalog_page");
	const router = useRouter();
	const { data: destinations = [] } = useGetCatalogDestinationsQuery();

	const destinationOptions = useMemo(
		() =>
			destinations.map((item) => ({
				label: item.title,
				value: item.id
			})),
		[destinations]
	);

	const localForm = useForm<TSearchTours>({
		resolver: zodResolver(searchToursSchema),
		defaultValues: {
			destination: "",
			dates: undefined
		}
	});

	const form = externalForm ?? localForm;

	const onSubmit = (data: TSearchTours) => {
		const route = buildRouteWithQuery(
			ENUM_PATH.MAIN.CATALOG,
			mapSearchToursToCatalogQuery(data)
		);
		router.push(route);
	};

	return (
		<Card className={className}>
			<CardContent>
				<Form {...form}>
					<form
						className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto_1fr_auto]"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<CustomField
							icon={MapPin}
							control={form.control}
							name="destination"
							label="search.where.label"
							placeholder="search.where.placeholder"
							fieldType="autocomplete"
							emptyText="search.where.empty"
							options={destinationOptions}
							t={t}
							className="mb-0"
						/>

						<Separator
							orientation="vertical"
							className="hidden h-8 md:block"
						/>

						<CustomField
							control={form.control}
							name="dates"
							label="search.when.label"
							placeholder="search.when.placeholder"
							fieldType="dateRange"
							t={t}
							className="mb-0"
						/>

						<Button
							type="submit"
							className="h-auto px-5 py-3 text-base sm:text-lg"
						>
							<span className="flex items-center gap-2">
								{t("search.submit")}
								<Search className="size-5" />
							</span>
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
