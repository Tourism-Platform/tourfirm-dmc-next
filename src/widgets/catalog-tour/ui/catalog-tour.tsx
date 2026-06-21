"use client";

import { ArrowLeft, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH } from "@/shared/config";
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
	useGetCatalogPreviewTourGeneralQuery,
	useGetCatalogPreviewTourOptionsQuery,
	useGetCatalogPreviewTourQuery
} from "@/entities/tour/catalog";

import { BookTourModal } from "@/features/booking/book-tour";

import {
	CATALOG_TOUR_SINGLE_OPTION_TABS,
	ENUM_CATALOG_TOUR_TAB
} from "../model";

import {
	CatalogTourHero,
	CatalogTourInformationSections,
	CatalogTourOptionsCards
} from "./tour";

const CatalogTourBase: FC = () => {
	const { tourId = "" } = useParams<{ tourId: string }>();
	const t = useTranslations("catalog_tour_page");

	const {
		data: previewData,
		isLoading: isPreviewLoading,
		isError: isPreviewError
	} = useGetCatalogPreviewTourQuery(tourId, {
		skip: !tourId
	});

	const {
		data: tourData,
		isLoading: isTourLoading,
		isError: isTourError
	} = useGetCatalogPreviewTourGeneralQuery(tourId, {
		skip: !tourId
	});

	const {
		data: optionsData,
		isLoading: isOptionsLoading,
		isError: isOptionsError
	} = useGetCatalogPreviewTourOptionsQuery(tourId, {
		skip: !tourId
	});

	const singleOption = optionsData?.length === 1 ? optionsData[0] : undefined;

	const {
		data: optionDetail,
		isLoading: isOptionDetailLoading,
		isError: isOptionDetailError
	} = useCatalogPreviewOptionDetail({
		tourId,
		optionId: singleOption?.id ?? "",
		skip: !singleOption
	});

	const isLoading =
		isPreviewLoading ||
		isTourLoading ||
		isOptionsLoading ||
		(Boolean(singleOption) && isOptionDetailLoading);

	const showOptionsCards = (optionsData?.length ?? 0) > 1;

	const bookTour = {
		id: tourData?.id ?? tourId,
		title: tourData?.tourTitle ?? ""
	};

	useEffect(() => {
		if (isPreviewError || isTourError || isOptionsError) {
			toast.error(t("toasts.load.error"));
		}
	}, [isPreviewError, isTourError, isOptionsError, t]);

	useEffect(() => {
		if (singleOption && isOptionDetailError) {
			toast.error(t("toasts.option.error"));
		}
	}, [singleOption, isOptionDetailError, t]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Loader className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-8 container pb-12 max-w-6xl mx-auto ">
			<div className="grid grid-cols-[1fr_auto] gap-8 items-start relative">
				<Link
					href={ENUM_PATH.MAIN.CATALOG.ROOT}
					className="absolute top-5 left-0"
				>
					<Button variant="ghost" size="sm">
						<ArrowLeft className="w-4 h-4" />
						{t("back")}
					</Button>
				</Link>
				<CatalogTourHero tour={tourData} />
				<BookTourModal
					tour={bookTour}
					triggerClassName="absolute top-5 right-0"
				/>
			</div>

			<div className="flex flex-col gap-8">
				{singleOption ? (
					<CustomOptionTabs
						defaultValue={ENUM_CATALOG_TOUR_TAB.TOUR_INFORMATION}
					>
						<CustomOptionTabsList
							className={cn("grid w-fit mb-4 grid-cols-3")}
						>
							{CATALOG_TOUR_SINGLE_OPTION_TABS.map((item) => (
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
						{CATALOG_TOUR_SINGLE_OPTION_TABS.map((item) => (
							<CustomOptionTabsContent
								key={item.type}
								value={item.type}
							>
								{item.type ===
								ENUM_CATALOG_TOUR_TAB.TOUR_INFORMATION ? (
									<item.slot data={previewData} />
								) : (
									<item.slot optionData={optionDetail} />
								)}
							</CustomOptionTabsContent>
						))}
					</CustomOptionTabs>
				) : (
					<>
						<CatalogTourInformationSections data={previewData} />
						{showOptionsCards && (
							<>
								<Separator />
								<CatalogTourOptionsCards
									options={optionsData ?? []}
								/>
							</>
						)}
					</>
				)}
			</div>
			<div className="flex justify-center">
				<BookTourModal tour={bookTour} />
			</div>
		</section>
	);
};

export const CatalogTour = withErrorBoundary(CatalogTourBase);
