"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, Skeleton, withErrorBoundary } from "@/shared/ui";

import {
	useGetCatalogPreviewOperatorQuery,
	useGetCatalogPreviewTourGeneralQuery
} from "@/entities/tour/catalog";

import { BookTourModal } from "@/features/booking/book-tour";

import { PROVIDER_CONTACTS } from "../../model";

const CatalogTourProviderCardBase: FC = () => {
	const t = useTranslations("catalog_tour_page");
	const { tourId = "" } = useParams<{ tourId: string }>();

	const { data: tourGeneral } = useGetCatalogPreviewTourGeneralQuery(tourId, {
		skip: !tourId
	});

	const {
		data,
		isError: isPreviewError,
		isLoading: isLoadingTourPreview
	} = useGetCatalogPreviewOperatorQuery(tourId);

	const providerData = PROVIDER_CONTACTS(data);

	useEffect(() => {
		if (isPreviewError) {
			toast.error(t("toasts.load.error"));
		}
	}, [isPreviewError, t]);

	return (
		<Card className="w-[400px] shrink-0 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-30 bg-blue-100" />
			<CardContent className="flex flex-col gap-4 pt-10">
				<div>
					<img
						src={data?.logo}
						alt={data?.business_name}
						className="h-26 w-26 rounded-full z-10 border-4 border-background relative z-10"
					/>
				</div>
				<p className="text-xs text-muted-foreground">
					{t("provider.title")}
				</p>
				<p className="font-semibold">
					{isLoadingTourPreview ? (
						<Skeleton className="h-6 w-1/2" />
					) : (
						data?.business_name
					)}
				</p>

				<div className="flex flex-col gap-2 text-sm text-muted-foreground">
					{providerData.map((item, index) => (
						<span key={index} className="flex items-center gap-2">
							<item.icon className="w-4 h-4" />
							{isLoadingTourPreview ? (
								<Skeleton className="h-5 w-1/2" />
							) : (
								item.value
							)}
						</span>
					))}
				</div>

				<BookTourModal
					tour={{
						id: tourGeneral?.id ?? tourId,
						title: tourGeneral?.tourTitle ?? ""
					}}
					triggerClassName="w-full"
				/>
			</CardContent>
		</Card>
	);
};

export const CatalogTourProviderCard = withErrorBoundary(
	CatalogTourProviderCardBase
);
