import type { TTimelineItemProps } from "@/shared/ui/blocks/types/block-render.types";

type TTimelineStepperProps = {
	items: TTimelineItemProps[];
};

export function TimelineStepper({ items }: TTimelineStepperProps) {
	if (!items.length) {
		return null;
	}

	return (
		<div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<article
						key={item.key ?? String(index)}
						className="relative"
					>
						{isLast ? null : (
							<span
								aria-hidden
								className="border-primary/40 absolute top-5 left-[52px] right-[-16px] hidden border-t-2 border-dashed lg:block"
							/>
						)}
						<div className="border-primary text-primary mb-[18px] flex size-[42px] items-center justify-center rounded-full border-2 bg-card text-[12.5px] font-bold">
							{String(index + 1).padStart(2, "0")}
						</div>
						<h3 className="text-foreground mb-1.5 text-[15px] font-semibold">
							{item.title}
						</h3>
						{item.description ? (
							<p className="text-muted-foreground text-[13.5px] leading-relaxed">
								{item.description}
							</p>
						) : null}
					</article>
				);
			})}
		</div>
	);
}
