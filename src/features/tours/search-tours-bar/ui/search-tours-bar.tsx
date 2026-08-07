"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search } from "lucide-react";
import { useLocale } from "next-intl";
import type { FC } from "react";
import { useMemo } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { useRouter } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import {
	Button,
	Card,
	CardContent,
	CustomField,
	Form,
	Separator
} from "@/shared/ui";
import { createNestedTextResolver, useUiContent } from "@/shared/ui-content";

import { useGeoSearchFieldProps } from "@/entities/geo";
import {
	type TSearchTours,
	createSearchToursSchema,
	mapSearchToursToCatalogQuery
} from "@/entities/tour";

interface ISearchToursBarProps {
	form?: UseFormReturn<TSearchTours>;
	className?: string;
}

export const SearchToursBar: FC<ISearchToursBarProps> = ({
	form: externalForm,
	className
}) => {
	const { tours } = useUiContent();
	const t = createNestedTextResolver(
		tours as unknown as Record<string, unknown>
	);
	const router = useRouter();
	const locale = useLocale();
	const geoField = useGeoSearchFieldProps(locale);

	const schema = useMemo(
		() => createSearchToursSchema(tours.search.where.required),
		[tours.search.where.required]
	);

	const localForm = useForm<TSearchTours>({
		resolver: zodResolver(schema),
		defaultValues: {
			destination: null,
			dates: undefined
		}
	});

	const form = externalForm ?? localForm;

	const onSubmit = (data: TSearchTours) => {
		const route = buildRouteWithQuery(
			ENUM_PATH.TOURS.CATALOG,
			mapSearchToursToCatalogQuery(data)
		);
		router.push(route);
	};

	return (
		<Card
			className={cn(
				"rounded-2xl border border-white/60 bg-background/95 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md",
				className
			)}
		>
			<CardContent className="px-4 sm:px-6">
				<Form {...form}>
					<form
						className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto] md:gap-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<CustomField
							icon={MapPin}
							control={form.control}
							name="destination"
							label="search.where.label"
							placeholder="search.where.placeholder"
							fieldType="geo"
							emptyText="search.where.empty"
							options={geoField.options}
							onQueryChange={geoField.onQueryChange}
							isLoading={geoField.isLoading}
							t={t}
							className="mb-0"
						/>

						<Separator
							orientation="vertical"
							className="bg-border/80 hidden h-10 md:block"
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
							size="lg"
							className="h-12 gap-2 rounded-xl px-6 text-base font-semibold shadow-sm sm:min-w-40"
						>
							{tours.search.submit}
							<Search className="size-5" />
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
