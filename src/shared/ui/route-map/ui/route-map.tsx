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

import type { TRouteMapProps } from "../types";

/** Always light label chrome — independent of theme / dark navy card. */
const LABEL = {
	surface: "rgba(255, 255, 255, 0.88)",
	border: "rgba(15, 45, 92, 0.14)",
	text: "#0f2d5c",
	badgeBg: "rgba(106, 176, 227, 0.28)",
	badgeText: "#0f2d5c",
	shadow: "0 2px 10px rgba(15, 23, 42, 0.1)"
} as const;

type TRouteMapColors = {
	line: string;
	nodeStroke: string;
};

function getRouteMapColors(): TRouteMapColors {
	const styles = getComputedStyle(document.documentElement);
	const primary = styles.getPropertyValue("--primary").trim() || "#6ab0e3";
	const navy = styles.getPropertyValue("--brand-navy").trim() || "#0f2d5c";

	return {
		line: primary,
		nodeStroke: navy
	};
}

function escapeHtml(value: string): string {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function createRouteMarkerIcon(label: number, name: string): L.DivIcon {
	const safeName = escapeHtml(name);

	return L.divIcon({
		className: "",
		html: `<div style="display:inline-flex;flex-direction:column;align-items:center;transform:translate(-50%,calc(-100% - 14px));pointer-events:none;">
			<div style="display:flex;align-items:center;gap:8px;background:${LABEL.surface};border:1px solid ${LABEL.border};border-radius:9999px;padding:5px 14px 5px 5px;box-shadow:${LABEL.shadow};white-space:nowrap;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">
				<span style="display:flex;width:28px;height:28px;flex-shrink:0;align-items:center;justify-content:center;border-radius:50%;background:${LABEL.badgeBg};color:${LABEL.badgeText};font-size:13px;font-weight:700;line-height:1;font-family:var(--font-sans);">${label}</span>
				<span style="font-size:15px;font-weight:700;color:${LABEL.text};font-family:var(--font-sans);">${safeName}</span>
			</div>
		</div>`,
		iconSize: [0, 0],
		iconAnchor: [0, 0]
	});
}

export function RouteMap({
	stops,
	center,
	zoom,
	minZoom,
	maxZoom,
	tileUrl,
	tileAttribution
}: TRouteMapProps) {
	const colors = getRouteMapColors();
	const positions = stops.map(
		(stop) => [stop.lat, stop.lng] as [number, number]
	);

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			minZoom={minZoom}
			maxZoom={maxZoom}
			scrollWheelZoom={false}
			className="h-full w-full"
		>
			<TileLayer url={tileUrl} attribution={tileAttribution} />
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
						color: colors.nodeStroke,
						weight: 2,
						fillColor: colors.line,
						fillOpacity: 1
					}}
				/>
			))}
			{stops.map((stop, index) => (
				<Marker
					key={stop.id}
					position={[stop.lat, stop.lng]}
					icon={createRouteMarkerIcon(index + 1, stop.name)}
					interactive={false}
				/>
			))}
			<ScaleControl imperial={false} position="bottomleft" />
		</MapContainer>
	);
}
