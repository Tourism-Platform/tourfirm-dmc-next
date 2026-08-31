import type { TCriteriaProps } from "@/shared/ui/blocks/types/block-render.types";

import { TagList } from "../../custom-tag-list";

type TTimelineCriteriaProps = {
	criteria: TCriteriaProps;
};

export function TimelineCriteria({ criteria }: TTimelineCriteriaProps) {
	const hasContent =
		criteria.label ||
		criteria.title ||
		criteria.description ||
		Boolean(criteria.tags?.length);

	if (!hasContent) {
		return null;
	}

	return (
		<div className="border-border bg-card mt-8 grid items-center gap-6 rounded-[10px] border px-6 py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
			<div>
				{criteria.label ? (
					<p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase before:mr-1 before:content-['—']">
						{criteria.label}
					</p>
				) : null}
				{criteria.title ? (
					<p className="text-foreground font-serif text-[19px] leading-snug italic">
						{criteria.title}
					</p>
				) : null}
			</div>
			<div>
				{criteria.description ? (
					<p className="text-muted-foreground text-sm leading-relaxed">
						{criteria.description}
					</p>
				) : null}
				<TagList tags={criteria.tags} />
			</div>
		</div>
	);
}
