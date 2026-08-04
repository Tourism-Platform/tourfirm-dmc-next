import {
	existsSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync
} from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://tourlink.orientstar.uz";
const RAW_DIR = join("scrape", "uzbekistan", "raw");
const MANIFEST_PATH = join("scrape", "uzbekistan", "manifest.json");
const INDEX_PATH = join("scrape", "uzbekistan", "index.json");

function unescapeFlight(str) {
	return str
		.replace(/\\"/g, '"')
		.replace(/\\\\/g, "\\")
		.replace(/\\n/g, "\n")
		.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
			String.fromCharCode(parseInt(h, 16))
		);
}

function extractBalancedArray(html, startIdx) {
	if (html[startIdx] !== "[") return null;
	let depth = 0;
	let inStr = false;
	let esc = false;
	for (let i = startIdx; i < html.length; i++) {
		const c = html[i];
		if (inStr) {
			if (esc) {
				esc = false;
				continue;
			}
			if (c === "\\") {
				esc = true;
				continue;
			}
			if (c === '"') inStr = false;
			continue;
		}
		if (c === '"') {
			inStr = true;
			continue;
		}
		if (c === "[") depth++;
		if (c === "]") {
			depth--;
			if (depth === 0) return html.slice(startIdx, i + 1);
		}
	}
	return null;
}

function extractBalancedObject(html, startIdx) {
	if (html[startIdx] !== "{") return null;
	let depth = 0;
	let inStr = false;
	let esc = false;
	for (let i = startIdx; i < html.length; i++) {
		const c = html[i];
		if (inStr) {
			if (esc) {
				esc = false;
				continue;
			}
			if (c === "\\") {
				esc = true;
				continue;
			}
			if (c === '"') inStr = false;
			continue;
		}
		if (c === '"') {
			inStr = true;
			continue;
		}
		if (c === "{") depth++;
		if (c === "}") {
			depth--;
			if (depth === 0) return html.slice(startIdx, i + 1);
		}
	}
	return null;
}

/** Extract route-map blocks from Next.js flight HTML (escaped JSON). */
export function extractRouteMaps(html) {
	const maps = [];
	const seen = new Set();
	let from = 0;

	while ((from = html.indexOf("route-map", from)) !== -1) {
		const windowStart = Math.max(0, from - 80);
		const windowEnd = Math.min(html.length, from + 20000);
		const windowRaw = html.slice(windowStart, windowEnd);
		const once = unescapeFlight(windowRaw);
		const twice = unescapeFlight(once);

		for (const candidate of [twice, once, windowRaw]) {
			const idMatch = candidate.match(
				/"id"\s*:\s*"([^"]*route-map[^"]*)"/
			);
			const markersIdx = candidate.indexOf('"markers"');
			const lineIdx = candidate.indexOf('"line"');
			if (markersIdx === -1 && lineIdx === -1) continue;

			let markers = [];
			let line = [];
			let mapId = idMatch?.[1] ?? null;

			if (markersIdx !== -1) {
				const arrStart = candidate.indexOf("[", markersIdx);
				const raw = extractBalancedArray(candidate, arrStart);
				if (raw) {
					try {
						markers = JSON.parse(raw);
					} catch {
						/* ignore */
					}
				}
			}
			if (lineIdx !== -1) {
				const arrStart = candidate.indexOf("[", lineIdx);
				const raw = extractBalancedArray(candidate, arrStart);
				if (raw) {
					try {
						line = JSON.parse(raw);
					} catch {
						/* ignore */
					}
				}
			}

			if (!markers.length && !line.length) continue;
			const key = `${mapId}|${markers.length}|${line.length}|${JSON.stringify(markers[0]?.coordinate ?? null)}`;
			if (seen.has(key)) break;
			seen.add(key);
			maps.push({
				id: mapId,
				markers: markers.map((m, i) => ({
					id: m.id ?? String(i + 1),
					label: m.label ?? null,
					description: m.description ?? null,
					coordinate: m.coordinate ?? null
				})),
				line
			});
			break;
		}
		from += 9;
	}
	return maps;
}

function extractLocationCoords(html) {
	const once = unescapeFlight(html);
	const twice = unescapeFlight(once);
	const locations = [];
	const re =
		/"location"\s*:\s*\{"coordinates"\s*:\s*\{"latitude"\s*:\s*(-?[\d.]+|null)\s*,\s*"longitude"\s*:\s*(-?[\d.]+|null)/g;
	let m;
	for (const src of [twice, once]) {
		while ((m = re.exec(src))) {
			const lat = m[1] === "null" ? null : Number(m[1]);
			const lng = m[2] === "null" ? null : Number(m[2]);
			if (lat != null && lng != null) {
				locations.push({ latitude: lat, longitude: lng });
			}
		}
		if (locations.length) break;
	}
	return locations;
}

function walkJsonFiles(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) out.push(...walkJsonFiles(p));
		else if (name.endsWith(".json")) out.push(p);
	}
	return out;
}

const files = walkJsonFiles(RAW_DIR);
console.error(`Re-extract maps for ${files.length} pages`);

let withMaps = 0;
let totalMarkers = 0;
const pageStats = [];

for (let i = 0; i < files.length; i++) {
	const file = files[i];
	const raw = JSON.parse(readFileSync(file, "utf8"));
	process.stderr.write(`[${i + 1}/${files.length}] ${raw.path}\n`);

	const html = await (
		await fetch(ORIGIN + raw.path, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; TourLinkScrape/1.0)",
				Accept: "text/html",
				"Accept-Language": "ru"
			}
		})
	).text();

	const maps = extractRouteMaps(html);
	const locations = extractLocationCoords(html);
	raw.maps = maps;
	raw.locations = locations;
	raw.mapExtractedAt = new Date().toISOString();
	writeFileSync(file, JSON.stringify(raw, null, 2), "utf8");

	const markers = maps.reduce((n, m) => n + m.markers.length, 0);
	if (maps.length) withMaps++;
	totalMarkers += markers;
	pageStats.push({
		path: raw.path,
		maps: maps.length,
		markers,
		locations: locations.length
	});
}

if (existsSync(MANIFEST_PATH)) {
	const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
	manifest.stats.withMaps = withMaps;
	manifest.stats.totalMarkers = totalMarkers;
	manifest.mapReextractedAt = new Date().toISOString();
	for (const p of manifest.pages) {
		const s = pageStats.find((x) => x.path === p.path);
		if (s) {
			p.maps = s.maps;
			p.markers = s.markers;
			p.locations = s.locations;
		}
	}
	writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

if (existsSync(INDEX_PATH)) {
	const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
	index.stats.withMaps = withMaps;
	index.stats.totalMarkers = totalMarkers;
	for (const p of index.pages) {
		const s = pageStats.find((x) => x.path === p.path);
		if (s) {
			p.maps = s.maps;
			p.markers = s.markers;
			p.locations = s.locations;
		}
	}
	writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
}

console.log(
	JSON.stringify(
		{
			pages: files.length,
			withMaps,
			totalMarkers,
			sample: pageStats.filter((p) => p.maps > 0).slice(0, 5)
		},
		null,
		2
	)
);
