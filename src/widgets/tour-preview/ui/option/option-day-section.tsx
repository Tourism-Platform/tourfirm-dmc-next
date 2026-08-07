"use client";

import { type FC } from "react";

import { interpolateTemplate } from "@/shared/lib/i18n/pluralize";
import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import { Badge } from "@/shared/ui/shadcn-ui/badge";

import type { IOptionDay } from "@/entities/tour/preview-tour";

import { OptionEventCard } from "./option-event-card";

interface IOptionDaySectionProps {
	day: IOptionDay;
	globalEventIndex: number;
}

const OptionDaySectionBase: FC<IOptionDaySectionProps> = ({
	day,
	globalEventIndex
}) => {
	const { preview } = useUiContent();

	return (
		<div className="w-full min-w-0 pb-12">
			<div className="mb-8 flex items-center gap-2">
				<Badge size="md" className="shrink-0 text-base" variant="black">
					{interpolateTemplate(preview.option.day.title, {
						n: day.day_number
					})}
				</Badge>
				{day.location ? (
					<>
						<span className="bg-primary size-1 shrink-0 rounded-full" />
						<span className="text-muted-foreground shrink-0">
							{day.location}
						</span>
					</>
				) : null}
				<div className="ml-2 min-w-0 flex-1 border-t border-dashed" />
			</div>

			<div className="flex w-full flex-col gap-8">
				{day.events.map((event, index) => (
					<OptionEventCard
						key={event.id}
						event={event}
						index={globalEventIndex + index}
					/>
				))}
			</div>
		</div>
	);
};

export const OptionDaySection = withErrorBoundary(OptionDaySectionBase);
