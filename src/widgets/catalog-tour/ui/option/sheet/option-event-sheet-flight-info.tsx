"use client";

import { MoreHorizontal, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC } from "react";

import type { IOptionFlightSegment } from "@/entities/tour/catalog";

interface IOptionEventSheetFlightInfoProps {
	segments: IOptionFlightSegment[];
}

export const OptionEventSheetFlightInfo: FC<
	IOptionEventSheetFlightInfoProps
> = ({ segments }) => {
	const t = useTranslations("catalog_tour_option_page");

	if (!segments.length) return null;

	return (
		<div>
			<h4 className="font-semibold mb-3">{t("sheet.flight_info")}</h4>
			<div className="flex flex-col gap-4">
				{segments.map((segment, index) => (
					<div
						key={`${segment.departureCode}-${index}`}
						className="rounded-lg border p-4 flex flex-col gap-4"
					>
						<div className="flex items-start justify-between gap-2">
							<div className="flex items-center gap-2 min-w-0">
								<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
									<Plane className="w-4 h-4 text-primary" />
								</div>
								<div className="min-w-0">
									<p className="font-semibold text-sm truncate">
										{segment.route}
									</p>
									<p className="text-xs text-muted-foreground">
										{segment.airlineCode &&
											`${segment.airlineCode}-`}
										{segment.flightNumber}
										{segment.dateRange &&
											` • ${segment.dateRange}`}
									</p>
								</div>
							</div>
							<button
								type="button"
								className="text-muted-foreground shrink-0"
								aria-label="More"
							>
								<MoreHorizontal className="w-4 h-4" />
							</button>
						</div>

						<div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
							<div>
								<p className="text-2xl font-bold leading-none">
									{segment.departureCode}
								</p>
								<p className="text-sm font-medium mt-1">
									{segment.departureTime}
								</p>
								<p className="text-xs text-muted-foreground mt-1 leading-snug">
									{segment.departurePlace}
								</p>
							</div>
							<Plane className="w-4 h-4 text-muted-foreground mx-1" />
							<div className="text-right">
								<p className="text-2xl font-bold leading-none">
									{segment.arrivalCode}
								</p>
								<p className="text-sm font-medium mt-1">
									{segment.arrivalTime}
								</p>
								<p className="text-xs text-muted-foreground mt-1 leading-snug">
									{segment.arrivalPlace}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
