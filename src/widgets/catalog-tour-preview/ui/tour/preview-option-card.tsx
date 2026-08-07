"use client";

import { type FC } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	Previewer,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

type TPreviewOptionCardProps = {
	tourId: string;
	option: IPreviewOptionCard;
};

const PreviewOptionCardBase: FC<TPreviewOptionCardProps> = ({
	tourId,
	option
}) => {
	const { preview } = useUiContent();
	const cardTexts = preview.tour.sections.itinerary.card;
	const href = buildRoute(ENUM_PATH.CATALOG.TOUR_OPTION, {
		tourId,
		optionId: option.id
	});

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-6 lg:flex-row">
					<div className="flex flex-1 flex-col gap-4">
						<div className="grid gap-3">
							<Badge>
								<CardTitle>{option.title}</CardTitle>
							</Badge>
							<CardDescription>
								<Previewer
									text={option.description}
									className="text-muted-foreground text-sm leading-relaxed"
								/>
							</CardDescription>
						</div>

						<div className="mt-auto flex items-end justify-between gap-4">
							<div>
								<p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
									{cardTexts.from}
								</p>
								<p className="text-xl font-bold">
									{option.price}{" "}
									<span className="text-base font-normal">
										{cardTexts.perPerson}
									</span>
								</p>
								<p className="text-muted-foreground mt-1 text-xs">
									{cardTexts.priceDepends}
								</p>
							</div>

							<Button
								asChild
								className="shrink-0 bg-blue-400 text-white hover:bg-blue-500"
							>
								<Link href={href}>
									{cardTexts.bookPackage}{" "}
									<span className="ml-2">→</span>
								</Link>
							</Button>
						</div>
					</div>

					<div className="w-full shrink-0 lg:w-[320px]">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={option.image}
							alt={option.title}
							className="h-[240px] w-full rounded-xl object-cover"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const PreviewOptionCard = withErrorBoundary(PreviewOptionCardBase);
