"use client";

import { ArrowLeft } from "lucide-react";
import { useLocale } from "next-intl";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Button,
	CustomOptionTabs,
	CustomOptionTabsContent,
	CustomOptionTabsList,
	CustomOptionTabsTrigger,
	DataLoader,
	Separator,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import {
	useGetPreviewTourGeneralQuery,
	useGetPreviewTourOptionsQuery,
	useGetPreviewTourQuery,
	usePreviewOptionDetail
} from "@/entities/tour/preview-tour";

import {
	ENUM_PREVIEW_TOUR_TAB,
	PREVIEW_TOUR_SINGLE_OPTION_TABS,
	getPreviewTourTabLabel
} from "../model";

import {
	PreviewOptionsCards,
	PreviewTourHero,
	PreviewTourInformationSections,
	PreviewTourProviderCard
} from "./tour";

type TPreviewTourProps = { tourId: string };

const PreviewTourBase: FC<TPreviewTourProps> = ({ tourId }) => {
	const locale = useLocale();
	const { preview } = useUiContent();
	const texts = preview.tour;

	const {
		data: previewData,
		isLoading: isPreviewLoading,
		isError: isPreviewError
	} = useGetPreviewTourQuery(tourId, {
		skip: !tourId
	});

	const {
		data: tourData,
		isLoading: isTourLoading,
		isError: isTourError
	} = useGetPreviewTourGeneralQuery(tourId, {
		skip: !tourId
	});

	const {
		data: optionsData,
		isLoading: isOptionsLoading,
		isError: isOptionsError
	} = useGetPreviewTourOptionsQuery(tourId, {
		skip: !tourId
	});

	const singleOption = optionsData?.length === 1 ? optionsData[0] : undefined;

	const {
		data: optionDetail,
		isLoading: isOptionDetailLoading,
		isError: isOptionDetailError
	} = usePreviewOptionDetail({
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

	useEffect(() => {
		if (isPreviewError || isTourError || isOptionsError) {
			toast.error(texts.toasts.load.error);
		}
	}, [isOptionsError, isPreviewError, texts.toasts.load.error, isTourError]);

	useEffect(() => {
		if (singleOption && isOptionDetailError) {
			toast.error(texts.toasts.option.error);
		}
	}, [singleOption, isOptionDetailError, texts.toasts.option.error]);

	if (isLoading) {
		return <DataLoader />;
	}

	return (
		<section className="relative flex w-full flex-col gap-8 pt-10">
			<Link href={ENUM_PATH.TOURS.ROOT} className="absolute top-0 left-0">
				<Button variant="ghost" size="sm">
					<ArrowLeft className="size-4" />
					{texts.back}
				</Button>
			</Link>

			<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_auto]">
				<PreviewTourHero tour={tourData} locale={locale} />
				<PreviewTourProviderCard tourId={tourId} />
			</div>

			<div className="flex flex-col gap-8">
				{singleOption ? (
					<CustomOptionTabs
						defaultValue={ENUM_PREVIEW_TOUR_TAB.TOUR_INFORMATION}
					>
						<CustomOptionTabsList className="mb-4 grid w-fit grid-cols-3">
							{PREVIEW_TOUR_SINGLE_OPTION_TABS.map((item) => (
								<CustomOptionTabsTrigger
									key={item.type}
									value={item.type}
									variant="tongue"
								>
									{getPreviewTourTabLabel(texts, item.type)}
								</CustomOptionTabsTrigger>
							))}
						</CustomOptionTabsList>
						<Separator className="mb-6" />
						{PREVIEW_TOUR_SINGLE_OPTION_TABS.map((item) => (
							<CustomOptionTabsContent
								key={item.type}
								value={item.type}
							>
								{item.type ===
								ENUM_PREVIEW_TOUR_TAB.TOUR_INFORMATION ? (
									<item.slot data={previewData} />
								) : (
									<item.slot optionData={optionDetail} />
								)}
							</CustomOptionTabsContent>
						))}
					</CustomOptionTabs>
				) : (
					<>
						<PreviewTourInformationSections data={previewData} />
						{showOptionsCards && (
							<>
								<Separator />
								<PreviewOptionsCards
									tourId={tourId}
									options={optionsData ?? []}
								/>
							</>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export const PreviewTour = withErrorBoundary(PreviewTourBase);
