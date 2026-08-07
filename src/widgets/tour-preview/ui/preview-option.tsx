"use client";

import { ArrowLeft, Loader } from "lucide-react";
import { useLocale } from "next-intl";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Button,
	CustomOptionTabs,
	CustomOptionTabsContent,
	CustomOptionTabsList,
	CustomOptionTabsTrigger,
	Separator,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import {
	useGetPreviewTourGeneralQuery,
	usePreviewOptionDetail
} from "@/entities/tour/preview-tour";

import { PREVIEW_OPTION_TABS_LIST, getPreviewOptionTabLabel } from "../model";

import { PreviewTourHero, PreviewTourProviderCard } from "./tour";

type TPreviewOptionProps = { tourId: string; optionId: string };

const PreviewOptionBase: FC<TPreviewOptionProps> = ({ tourId, optionId }) => {
	const locale = useLocale();
	const { preview } = useUiContent();
	const texts = preview.option;

	const {
		data: tourData,
		isLoading: isTourLoading,
		isError: isTourError
	} = useGetPreviewTourGeneralQuery(tourId, {
		skip: !tourId
	});

	const {
		data: optionDetail,
		isLoading: isOptionLoading,
		isError: isOptionError
	} = usePreviewOptionDetail({ tourId, optionId });

	const isLoading = isTourLoading || isOptionLoading;

	useEffect(() => {
		if (isTourError || isOptionError) {
			toast.error(preview.tour.toasts.load.error);
		}
	}, [isTourError, isOptionError, preview.tour.toasts.load.error]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Loader className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const defaultTab = PREVIEW_OPTION_TABS_LIST[0]?.type ?? "";

	return (
		<section className="relative mt-6 flex w-full flex-col gap-8">
			<Link
				href={buildRoute(ENUM_PATH.TOURS.TOUR, { tourId })}
				className="absolute top-0 left-0"
			>
				<Button variant="ghost" size="sm">
					<ArrowLeft className="size-4" />
					{texts.back}
				</Button>
			</Link>

			<div className="mb-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_auto]">
				{tourData && (
					<PreviewTourHero tour={tourData} locale={locale} />
				)}
				<PreviewTourProviderCard tourId={tourId} />
			</div>

			<div className="flex flex-col mt-4">
				<CustomOptionTabs defaultValue={defaultTab}>
					<CustomOptionTabsList className="mb-4 grid w-fit grid-cols-2">
						{PREVIEW_OPTION_TABS_LIST.map((item) => (
							<CustomOptionTabsTrigger
								key={item.type}
								value={item.type}
								variant="tongue"
							>
								{getPreviewOptionTabLabel(texts, item.type)}
							</CustomOptionTabsTrigger>
						))}
					</CustomOptionTabsList>
					<Separator className="mb-6" />
					{PREVIEW_OPTION_TABS_LIST.map((item) => (
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

export const PreviewOption = withErrorBoundary(PreviewOptionBase);
