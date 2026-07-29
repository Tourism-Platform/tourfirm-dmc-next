import { cn } from "@/shared/lib/utils";

import type { TRouteMapPanelProps } from "../types/route-map-panel.types";

export function RouteMapPanel({ children, className }: TRouteMapPanelProps) {
	return (
		<div
			className={cn(
				"bg-muted relative z-0 isolate aspect-[16/9] min-h-[280px] w-full min-w-0 overflow-hidden rounded-2xl border",
				className
			)}
		>
			{children}
		</div>
	);
}
