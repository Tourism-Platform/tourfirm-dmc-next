import type { TRouteMapPanelProps } from "../types/route-map-panel.types";

export function RouteMapPanel({ children }: TRouteMapPanelProps) {
	return (
		<div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl border">
			{children}
		</div>
	);
}
