import type { TRouteTimelineItem } from "@/cms/lib/map-route-points";

type TProps = {
	items: TRouteTimelineItem[];
};

export function RouteStopsTimeline({ items }: TProps) {
	if (!items.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-xl font-semibold sm:text-2xl">
				Route timeline
			</h2>
			<ol className="relative flex flex-col gap-4 border-l pl-6">
				{items.map((item) => (
					<li key={item.id} className="relative">
						<span className="bg-primary absolute top-2 -left-[1.6rem] h-3 w-3 rounded-full" />
						<div className="flex flex-col gap-1">
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
									{item.typeLabel}
								</span>
								<span className="text-muted-foreground text-xs">
									Stop {item.order}
								</span>
							</div>
							<p className="text-base font-semibold">
								{item.title}
							</p>
							{item.subtitle ? (
								<p className="text-muted-foreground text-sm">
									{item.subtitle}
								</p>
							) : null}
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
