"use client";

import { Bed, Bus, Map } from "lucide-react";
import { type FC, type ReactNode } from "react";

import { PreviewerSimple, Separator, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import { Badge } from "@/shared/ui/shadcn-ui/badge";

import type {
	IOptionDetail,
	TOptionSheetSource
} from "@/entities/tour/preview-tour";

import { type TPricingAccommodationRow, groupPricingEvents } from "../../model";

import { OptionEventDetailSheet } from "./option-event-detail-sheet";

interface IPricingProps {
	optionData?: IOptionDetail;
}

const PricingEventItem: FC<{ source: TOptionSheetSource }> = ({ source }) => (
	<li className="flex flex-col gap-1.5 border-b border-border/60 py-3 first:pt-0 last:border-b-0 last:pb-0">
		<p className="text-sm font-medium">{source.title}</p>
		{source.sheet.description ? (
			<PreviewerSimple
				text={source.sheet.description}
				lines={2}
				className="text-sm text-muted-foreground"
			/>
		) : null}
		<OptionEventDetailSheet source={source} />
	</li>
);

const AccommodationRow: FC<{ row: TPricingAccommodationRow }> = ({ row }) => {
	const { preview } = useUiContent();
	const texts = preview.option.pricing;

	if (row.kind === "single") {
		return <PricingEventItem source={row.source} />;
	}

	return (
		<li className="flex flex-col gap-2 border-b border-border/60 py-3 first:pt-0 last:border-b-0 last:pb-0">
			<p className="text-xs text-muted-foreground">{texts.choiceOf}</p>
			<div className="flex flex-col gap-3">
				{row.sources.map((source, index) => (
					<div
						key={`${source.title}-${index}`}
						className="flex flex-col gap-1.5"
					>
						{index > 0 ? (
							<span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
								{texts.or}
							</span>
						) : null}
						<p className="text-sm font-medium">{source.title}</p>
						{source.sheet.description ? (
							<PreviewerSimple
								text={source.sheet.description}
								lines={2}
								className="text-sm text-muted-foreground"
							/>
						) : null}
						<OptionEventDetailSheet source={source} />
					</div>
				))}
			</div>
		</li>
	);
};

interface IPricingGroupProps {
	icon: ReactNode;
	title: string;
	blurb: string;
	count: number;
	children: ReactNode;
}

const PricingGroup: FC<IPricingGroupProps> = ({
	icon,
	title,
	blurb,
	count,
	children
}) => (
	<section className="flex flex-col gap-4 border-b border-border py-6 last:border-b-0">
		<div className="flex items-start gap-3">
			<div className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-full">
				{icon}
			</div>
			<div className="flex min-w-0 flex-col gap-1">
				<div className="flex flex-wrap items-center gap-2">
					<h4 className="text-base font-semibold">{title}</h4>
					<Badge variant="black" size="sm">
						{count}
					</Badge>
				</div>
				<p className="text-muted-foreground text-sm">{blurb}</p>
			</div>
		</div>
		<ul className="flex flex-col pl-0 sm:pl-[52px]">{children}</ul>
	</section>
);

const PricingBase: FC<IPricingProps> = ({ optionData }) => {
	const { preview } = useUiContent();
	const texts = preview.option.pricing;
	const groups = groupPricingEvents(optionData?.days);

	const accommodationCount = groups.accommodation.reduce((sum, row) => {
		if (row.kind === "single") return sum + 1;
		return sum + row.sources.length;
	}, 0);

	return (
		<div className="flex w-full flex-col py-2">
			<h2 className="mb-6 text-2xl font-bold">{texts.title}</h2>

			<div className="mb-2 flex items-end justify-between gap-4">
				<span className="text-muted-foreground text-sm">
					{texts.totalPrice}
				</span>
				<span className="text-2xl font-bold tracking-tight">
					{optionData?.price ?? "—"}
				</span>
			</div>
			<p className="text-muted-foreground mb-8 text-sm">
				{texts.totalHint}
			</p>

			{(accommodationCount > 0 ||
				groups.activity.length > 0 ||
				groups.transportation.length > 0) && (
				<>
					<h3 className="mb-2 text-xl font-bold">{texts.details}</h3>
					<p className="text-muted-foreground mb-4 text-sm">
						{texts.detailsHint}
					</p>
					<Separator className="mb-2" />

					<div className="flex flex-col">
						{accommodationCount > 0 && (
							<PricingGroup
								icon={<Bed className="w-5 h-5 text-primary" />}
								title={texts.accomodation}
								blurb={texts.sections.accommodation.blurb}
								count={accommodationCount}
							>
								{groups.accommodation.map((row, index) => (
									<AccommodationRow key={index} row={row} />
								))}
							</PricingGroup>
						)}

						{groups.activity.length > 0 && (
							<PricingGroup
								icon={<Map className="w-5 h-5 text-primary" />}
								title={texts.activity}
								blurb={texts.sections.activity.blurb}
								count={groups.activity.length}
							>
								{groups.activity.map((source, index) => (
									<PricingEventItem
										key={`${source.title}-${index}`}
										source={source}
									/>
								))}
							</PricingGroup>
						)}

						{groups.transportation.length > 0 && (
							<PricingGroup
								icon={<Bus className="w-5 h-5 text-primary" />}
								title={texts.transportation}
								blurb={texts.sections.transportation.blurb}
								count={groups.transportation.length}
							>
								{groups.transportation.map((source, index) => (
									<PricingEventItem
										key={`${source.title}-${index}`}
										source={source}
									/>
								))}
							</PricingGroup>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export const Pricing = withErrorBoundary(PricingBase);
