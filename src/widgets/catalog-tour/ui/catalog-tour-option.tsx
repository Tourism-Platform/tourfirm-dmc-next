"use client";

import { ArrowLeft, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
	Button,
	CustomOptionTabs,
	CustomOptionTabsContent,
	CustomOptionTabsList,
	CustomOptionTabsTrigger,
	Separator,
	withErrorBoundary
} from "@/shared/ui";

import {
	useCatalogPreviewOptionDetail,
	useGetCatalogPreviewTourGeneralQuery
} from "@/entities/tour/catalog";

import { CATALOG_OPTION_TABS_LIST } from "../model";

import { CatalogTourHero, CatalogTourProviderCard } from "./tour";

const CatalogTourOptionBase: FC = () => {
	const { tourId = "", optionId = "" } = useParams<{
		tourId: string;
		optionId: string;
	}>();
	const t = useTranslations("catalog_tour_option_page");

	const {
		data: tourData,
		isLoading: isTourLoading,
		isError: isTourError
	} = useGetCatalogPreviewTourGeneralQuery(tourId, {
		skip: !tourId
	});

	const {
		data: optionDetail,
		isLoading: isOptionLoading,
		isError: isOptionError
	} = useCatalogPreviewOptionDetail({ tourId, optionId });

	const isLoading = isTourLoading || isOptionLoading;

	useEffect(() => {
		if (isTourError || isOptionError) {
			toast.error("Failed to load tour data");
		}
	}, [isTourError, isOptionError, t]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Loader className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const defaultTab = CATALOG_OPTION_TABS_LIST[0]?.type ?? "";

	return (
		<section className="flex flex-col gap-8 container pb-12 mt-6 max-w-6xl mx-auto relative">
			<Link
				href={buildRoute(ENUM_PATH.MAIN.CATALOG.TOUR, {
					tourId
				})}
				className="absolute top-0 left-0"
			>
				<Button variant="ghost" size="sm">
					<ArrowLeft className="w-4 h-4" />
					{t("back")}
				</Button>
			</Link>

			<div className="grid grid-cols-[1fr_auto] gap-8 items-start mb-8">
				{tourData && <CatalogTourHero tour={tourData} />}
				<CatalogTourProviderCard />
			</div>

			<div className="flex flex-col mt-4">
				<CustomOptionTabs defaultValue={defaultTab}>
					<CustomOptionTabsList
						className={cn("grid w-fit mb-4 grid-cols-2")}
					>
						{CATALOG_OPTION_TABS_LIST.map((item) => (
							<CustomOptionTabsTrigger
								key={item.type}
								value={item.type}
								variant="tongue"
							>
								{t(item.label)}
							</CustomOptionTabsTrigger>
						))}
					</CustomOptionTabsList>
					<Separator className="mb-6" />
					{CATALOG_OPTION_TABS_LIST.map((item) => (
						<CustomOptionTabsContent
							key={item.type}
							value={item.type}
						>
							<item.slot optionData={optionDetail} />
						</CustomOptionTabsContent>
					))}
				</CustomOptionTabs>
			</div>
		</section>
	);
};

export const CatalogTourOption = withErrorBoundary(CatalogTourOptionBase);
