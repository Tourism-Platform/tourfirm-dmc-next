"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
	CircleMarker,
	MapContainer,
	Marker,
	Polyline,
	ScaleControl,
	TileLayer
} from "react-leaflet";

import {
	ROUTE_MAP_CENTER,
	ROUTE_MAP_MAX_ZOOM,
	ROUTE_MAP_MIN_ZOOM,
	ROUTE_MAP_TILE_ATTRIBUTION,
	ROUTE_MAP_TILE_URL,
	ROUTE_MAP_ZOOM
} from "../model";
import type { TRouteMapStop } from "../model/types/route-map.types";

type TRouteMapProps = {
	stops: TRouteMapStop[];
};

type TRouteMapColors = {
	line: string;
	badgeBg: string;
	text: string;
	border: string;
	surface: string;
};

function getRouteMapColors(): TRouteMapColors {
	const styles = getComputedStyle(document.documentElement);

	return {
		line: styles.getPropertyValue("--primary").trim(),
		badgeBg: styles.getPropertyValue("--secondary").trim(),
		text: styles.getPropertyValue("--secondary-foreground").trim(),
		border: styles.getPropertyValue("--border").trim(),
		surface: styles.getPropertyValue("--card").trim()
	};
}

function createRouteMarkerIcon(
	order: number,
	name: string,
	colors: TRouteMapColors
): L.DivIcon {
	return L.divIcon({
		className: "",
		html: `<div style="display:inline-flex;flex-direction:column;align-items:center;transform:translate(-50%,calc(-100% - 14px));">
			<div style="display:flex;align-items:center;gap:8px;background:${colors.surface};border:1px solid ${colors.border};border-radius:9999px;padding:5px 14px 5px 5px;box-shadow:0 2px 8px rgba(15,23,42,0.08);white-space:nowrap;">
				<span style="display:flex;width:28px;height:28px;flex-shrink:0;align-items:center;justify-content:center;border-radius:50%;background:${colors.badgeBg};color:${colors.text};font-size:13px;font-weight:700;line-height:1;font-family:var(--font-exo-2),sans-serif;">${order}</span>
				<span style="font-size:15px;font-weight:700;color:${colors.text};font-family:var(--font-exo-2),sans-serif;">${name}</span>
			</div>
		</div>`,
		iconSize: [0, 0],
		iconAnchor: [0, 0]
	});
}

export function RouteMap({ stops }: TRouteMapProps) {
	const colors = getRouteMapColors();
	const positions = stops.map(
		(stop) => [stop.lat, stop.lng] as [number, number]
	);

	return (
		<MapContainer
			center={ROUTE_MAP_CENTER}
			zoom={ROUTE_MAP_ZOOM}
			minZoom={ROUTE_MAP_MIN_ZOOM}
			maxZoom={ROUTE_MAP_MAX_ZOOM}
			scrollWheelZoom={false}
			className="h-full w-full"
		>
			<TileLayer
				url={ROUTE_MAP_TILE_URL}
				attribution={ROUTE_MAP_TILE_ATTRIBUTION}
			/>
			<Polyline
				positions={positions}
				pathOptions={{
					color: colors.line,
					weight: 4,
					lineCap: "round",
					lineJoin: "round"
				}}
			/>
			{stops.map((stop) => (
				<CircleMarker
					key={`node-${stop.id}`}
					center={[stop.lat, stop.lng]}
					radius={6}
					pathOptions={{
						color: colors.text,
						weight: 2,
						fillColor: colors.line,
						fillOpacity: 1
					}}
				/>
			))}
			{stops.map((stop) => (
				<Marker
					key={stop.id}
					position={[stop.lat, stop.lng]}
					icon={createRouteMarkerIcon(stop.order, stop.name, colors)}
				/>
			))}
			<ScaleControl imperial={false} position="bottomleft" />
		</MapContainer>
	);
}
