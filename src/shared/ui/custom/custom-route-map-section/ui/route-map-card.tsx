import { ExternalLink } from "lucide-react";

import { Link } from "@/shared/i18n";
import type { TRouteMapPanelHeaderProps } from "@/shared/ui/blocks/types/block-render.types";
import { RouteMapView } from "@/shared/ui/route-map";
import type { TRouteMapProps } from "@/shared/ui/route-map";

type TRouteMapCardProps = TRouteMapPanelHeaderProps & TRouteMapProps;

function isExternalHref(href: string): boolean {
	return /^https?:\/\//i.test(href);
}

export function RouteMapCard({
	eyebrow,
	title,
	description,
	linkLabel,
	linkHref,
	...mapProps
}: TRouteMapCardProps) {
	const hasHeader =
		eyebrow || title || description || (linkLabel && linkHref);
	const linkClassName =
		"text-foreground hover:text-primary inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors";

	return (
		<div className="bg-card flex min-w-0 w-full flex-col gap-4 overflow-hidden rounded-2xl border p-4 sm:gap-5 sm:p-5 lg:h-full lg:p-6">
			{hasHeader ? (
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 max-w-2xl flex-col gap-2">
						{eyebrow ? (
							<p className="text-muted-foreground font-mono text-xs font-medium uppercase tracking-[0.16em] sm:text-sm">
								{eyebrow}
							</p>
						) : null}
						{title ? (
							<h3 className="font-serif text-2xl font-normal italic break-words sm:text-3xl">
								{title}
							</h3>
						) : null}
						{description ? (
							<p className="text-muted-foreground text-sm break-words sm:text-base">
								{description}
							</p>
						) : null}
					</div>
					{linkLabel && linkHref ? (
						isExternalHref(linkHref) ? (
							<a
								href={linkHref}
								target="_blank"
								rel="noopener noreferrer"
								className={linkClassName}
							>
								{linkLabel}
								<ExternalLink
									className="size-3.5"
									aria-hidden
								/>
							</a>
						) : (
							<Link href={linkHref} className={linkClassName}>
								{linkLabel}
								<ExternalLink
									className="size-3.5"
									aria-hidden
								/>
							</Link>
						)
					) : null}
				</div>
			) : null}
			<div className="min-w-0 w-full lg:min-h-0 lg:flex-1">
				<RouteMapView
					{...mapProps}
					className="aspect-[4/3] min-h-[220px] w-full border-0 sm:aspect-[16/9] sm:min-h-[280px]"
				/>
			</div>
		</div>
	);
}
