"use client";

import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useRouter } from "@/shared/i18n";
import {
	Button,
	Card,
	CardContent,
	Skeleton,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { useGetPreviewOperatorQuery } from "@/entities/tour";

import { PROVIDER_CONTACTS } from "../../model";

interface IPreviewTourProviderCardProps {
	tourId: string;
}

const PreviewTourProviderCardBase: FC<IPreviewTourProviderCardProps> = ({
	tourId
}) => {
	const router = useRouter();
	const { preview } = useUiContent();
	const texts = preview.tour;

	const {
		data,
		isError: isPreviewError,
		isLoading: isLoadingTourPreview
	} = useGetPreviewOperatorQuery(tourId, { skip: !tourId });

	const providerData = PROVIDER_CONTACTS(data);

	const handleBooking = () => {
		const path = buildRoute(ENUM_PATH.TOURS.BOOKING, { tourId });
		router.push(path);
	};

	useEffect(() => {
		if (isPreviewError) {
			toast.error(texts.toasts.load.error);
		}
	}, [isPreviewError, texts.toasts.load.error]);

	return (
		<Card className="relative w-[400px] shrink-0 overflow-hidden">
			<div className="absolute top-0 left-0 h-30 w-full bg-blue-100" />
			<CardContent className="flex flex-col gap-4 pt-10">
				<div>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={data?.logo}
						alt={data?.business_name}
						className="border-background relative z-10 h-26 w-26 rounded-full border-4"
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					{texts.provider.title}
				</p>
				<p className="font-semibold">
					{isLoadingTourPreview ? (
						<Skeleton className="h-6 w-1/2" />
					) : (
						data?.business_name
					)}
				</p>

				<div className="text-muted-foreground flex flex-col gap-2 text-sm">
					{providerData.map((item, index) => (
						<span key={index} className="flex items-center gap-2">
							<item.icon className="size-4" />
							{isLoadingTourPreview ? (
								<Skeleton className="h-5 w-1/2" />
							) : (
								item.value
							)}
						</span>
					))}
				</div>

				<Button onClick={handleBooking}>{texts.bookNow}</Button>
			</CardContent>
		</Card>
	);
};

export const PreviewTourProviderCard = withErrorBoundary(
	PreviewTourProviderCardBase
);
