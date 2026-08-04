import { createHash } from "node:crypto";
import {
	createWriteStream,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync
} from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ORIGIN = "https://tourlink.orientstar.uz";
const GRAPH_PATH = join(ROOT, "docs", "tourlink-link-graph.json");

const CONCURRENCY = 4;
const SKIP_IMG =
	/(logo|favicon|sprite|icon-only|avatar-placeholder|data:image)/i;

/** CLI: --country=kazakhstan --locales=ru,en,uz --only=region-slug */
function parseArgs(argv) {
	const locales = [];
	let only = null;
	let country = null;
	for (const arg of argv) {
		if (arg.startsWith("--locales=")) {
			locales.push(
				...arg
					.slice("--locales=".length)
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean)
			);
		} else if (arg.startsWith("--only=")) {
			only = arg.slice("--only=".length).trim() || null;
		} else if (arg.startsWith("--country=")) {
			country = arg.slice("--country=".length).trim() || null;
		}
	}
	return {
		locales: locales.length ? locales : ["ru", "en", "uz"],
		only,
		country
	};
}

const { locales: LOCALES, only: ONLY_FILTER, country: COUNTRY_ARG } = parseArgs(
	process.argv.slice(2)
);
const COUNTRY = (COUNTRY_ARG || "uzbekistan").toLowerCase();
const OUT_ROOT = join(ROOT, "scrape", COUNTRY);
const RAW_DIR = join(OUT_ROOT, "raw");
const MEDIA_DIR = join(OUT_ROOT, "media");
const MANIFEST_PATH = join(OUT_ROOT, "manifest.json");
const INDEX_PATH = join(OUT_ROOT, "index.json");

mkdirSync(RAW_DIR, { recursive: true });
mkdirSync(MEDIA_DIR, { recursive: true });

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function slugify(input) {
	return String(input || "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/&amp;/g, "and")
		.replace(/[^a-zA-Z0-9а-яА-ЯёЁўҚқҒғҲҳ\-_.]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase()
		.slice(0, 80);
}

function entityFromPath(path, locale = "ru") {
	const prefix = `/${locale}/destinations/${COUNTRY}`;
	const rest = path.replace(prefix, "").replace(/^\//, "");
	const parts = rest.split("/").filter(Boolean);
	if (parts.length === 0) {
		return { type: "country", country: COUNTRY, parts, locale };
	}
	if (parts.length === 1) {
		return {
			type: "region",
			country: COUNTRY,
			region: parts[0],
			parts,
			locale
		};
	}
	if (parts.length === 2) {
		return {
			type: "city",
			country: COUNTRY,
			region: parts[0],
			city: parts[1],
			parts,
			locale
		};
	}
	return {
		type: "attraction",
		country: COUNTRY,
		region: parts[0],
		city: parts[1],
		attraction: parts[2],
		parts,
		locale
	};
}

function mediaRelDir(entity) {
	const base = ["destinations", COUNTRY];
	if (entity.region) base.push("regions", entity.region);
	if (entity.city) base.push("cities", entity.city);
	if (entity.attraction) base.push("attractions", entity.attraction);
	return join(...base);
}

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

function extractRouteMaps(html) {
	const maps = [];
	const seen = new Set();
	let from = 0;

	while ((from = html.indexOf("route-map", from)) !== -1) {
		const windowRaw = html.slice(
			Math.max(0, from - 80),
			Math.min(html.length, from + 20000)
		);
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
			const key = `${idMatch?.[1] ?? ""}|${markers.length}|${line.length}|${JSON.stringify(markers[0]?.coordinate ?? null)}`;
			if (seen.has(key)) break;
			seen.add(key);
			maps.push({
				id: idMatch?.[1] ?? null,
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

function extractTitle(html) {
	const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractMeta(html) {
	const get = (re) => {
		const m = html.match(re);
		return m ? m[1].trim() : null;
	};
	return {
		description: get(
			/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
		),
		ogTitle: get(
			/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i
		),
		ogDescription: get(
			/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i
		),
		ogImage: get(
			/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i
		)
	};
}

function extractHeadings(html) {
	const out = [];
	const re = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
	let m;
	while ((m = re.exec(html))) {
		const text = m[2]
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (text) out.push({ tag: m[1].toLowerCase(), text });
	}
	return out;
}

function extractBadgesAndIcons(html) {
	const badges = new Set();
	const icons = new Set();
	const themes = new Set();

	const badgeLike =
		/\b(UNESCO|FEATURED|MUST_SEE|TOP_PICK|Главное|Рекомендуем|Must see|Специнтерес|Культура|Природа|Ремёсла|Еда|Туристический регион|Город)\b/gi;
	let m;
	while ((m = badgeLike.exec(html))) {
		badges.add(m[1]);
	}

	const lucide =
		/data-lucide=["']([^"']+)["']|icon["']?\s*:\s*["']([a-z0-9-]+)["']/gi;
	while ((m = lucide.exec(html))) {
		icons.add(m[1] || m[2]);
	}

	const themeLabels = [
		"Культура",
		"Природа",
		"Ремёсла",
		"Еда",
		"Специнтерес",
		"Culture",
		"Nature",
		"Crafts",
		"Food"
	];
	for (const t of themeLabels) {
		if (html.includes(t)) themes.add(t);
	}

	return {
		badges: [...badges],
		icons: [...icons],
		themes: [...themes]
	};
}

function unwrapNextImage(url) {
	try {
		const u = new URL(url, ORIGIN);
		if (u.pathname.includes("/_next/image")) {
			const inner = u.searchParams.get("url");
			if (inner) return new URL(inner, ORIGIN).href;
		}
		return u.href;
	} catch {
		return null;
	}
}

function collectImageUrls(html) {
	const found = new Map();

	const add = (raw, role, alt = "") => {
		if (!raw || SKIP_IMG.test(raw)) return;
		const abs = unwrapNextImage(raw);
		if (!abs) return;
		if (!/^https?:\/\//i.test(abs)) return;
		const hasExt = /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(abs);
		const isMediaPath =
			abs.includes("/api/media") ||
			abs.includes("/media/") ||
			abs.includes("/_next/image");
		if (!hasExt && !isMediaPath) return;
		if (!found.has(abs)) {
			found.set(abs, { url: abs, role, alt: alt || "" });
		}
	};

	const meta = extractMeta(html);
	if (meta.ogImage) add(meta.ogImage, "og");

	const imgRe =
		/<img\b[^>]*(?:src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']|alt=["']([^"']*)["'][^>]*src=["']([^"']+)["']|src=["']([^"']+)["'])[^>]*>/gi;
	let m;
	while ((m = imgRe.exec(html))) {
		const src = m[1] || m[4] || m[5];
		const alt = m[2] || m[3] || "";
		add(src, "img", alt);
	}

	const srcsetRe = /srcset=["']([^"']+)["']/gi;
	while ((m = srcsetRe.exec(html))) {
		for (const part of m[1].split(",")) {
			const u = part.trim().split(/\s+/)[0];
			add(u, "srcset");
		}
	}

	// RSC / JSON image urls
	const urlRe =
		/https?:\\?\/\\?\/[^"'\\\s>]+\.(?:jpe?g|png|webp|avif|gif)/gi;
	while ((m = urlRe.exec(html))) {
		const cleaned = m[0].replace(/\\\//g, "/");
		add(cleaned, "payload");
	}

	const mediaApi =
		/["'](\/_next\/image\?[^"']+|\/api\/media\/[^"']+|\/media\/[^"']+)["']/gi;
	while ((m = mediaApi.exec(html))) {
		add(m[1], "media-api");
	}

	return [...found.values()];
}

function pickFilename(url, alt, role, index) {
	try {
		const u = new URL(url);
		const base = u.pathname.split("/").filter(Boolean).pop() || "";
		const clean = base.split("?")[0];
		if (clean && /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(clean)) {
			return clean.toLowerCase();
		}
	} catch {
		/* ignore */
	}
	const fromAlt = slugify(alt);
	if (fromAlt) {
		return `${fromAlt}.jpg`;
	}
	return `${role || "img"}-${String(index + 1).padStart(2, "0")}.jpg`;
}

async function downloadImage(url, destPath) {
	mkdirSync(dirname(destPath), { recursive: true });
	if (existsSync(destPath)) {
		return { ok: true, skipped: true };
	}
	const resp = await fetch(url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; TourLinkScrape/1.0)",
			Accept: "image/*,*/*"
		}
	});
	if (!resp.ok || !resp.body) {
		return { ok: false, status: resp.status };
	}
	await pipeline(Readable.fromWeb(resp.body), createWriteStream(destPath));
	return { ok: true, skipped: false };
}

function contentHash(buf) {
	return createHash("sha1").update(buf).digest("hex").slice(0, 12);
}

function loadCountryUrls(locale) {
	const prefix = `/${locale}/destinations/${COUNTRY}`;
	const graph = JSON.parse(readFileSync(GRAPH_PATH, "utf8"));
	const ruPrefix = `/ru/destinations/${COUNTRY}`;
	let paths = graph.nodes
		.filter(
			(n) =>
				typeof n.path === "string" &&
				n.path.startsWith(ruPrefix) &&
				n.status === 200
		)
		.map((n) => n.path.replace(/^\/ru\//, `/${locale}/`));

	if (!paths.includes(prefix)) {
		paths.unshift(prefix);
	}

	if (ONLY_FILTER) {
		const needle = ONLY_FILTER.toLowerCase();
		paths = paths.filter((p) => {
			const rest = p.replace(prefix, "");
			if (!rest || rest === "/") return needle === COUNTRY;
			return rest.toLowerCase().includes(`/${needle}`) || rest.toLowerCase().startsWith(`/${needle}`);
		});
		// Always keep region root for filter slug
		const regionPath = `${prefix}/${needle}`;
		if (!paths.includes(regionPath) && needle !== COUNTRY) {
			paths.push(regionPath);
		}
	}

	return [...new Set(paths)]
		.sort((a, b) => a.localeCompare(b))
		.map((path) => ({
			path,
			url: ORIGIN + path,
			locale,
			title: ""
		}));
}

async function scrapePage(entry, mediaIndex) {
	const entity = entityFromPath(entry.path, entry.locale || "ru");
	const resp = await fetch(entry.url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; TourLinkScrape/1.0)",
			Accept: "text/html",
			"Accept-Language": `${entry.locale || "ru"},en;q=0.8`
		}
	});
	const status = resp.status;
	const html = await resp.text();
	const title = extractTitle(html);
	const meta = extractMeta(html);
	const headings = extractHeadings(html);
	const chips = extractBadgesAndIcons(html);
	const maps = extractRouteMaps(html);
	const images = collectImageUrls(html);

	const mediaRel = mediaRelDir(entity);
	const pageMedia = [];

	for (let i = 0; i < images.length; i++) {
		const img = images[i];
		let filename = pickFilename(img.url, img.alt, img.role, i);
		const localRel = join(mediaRel, filename).replace(/\\/g, "/");
		let localAbs = join(MEDIA_DIR, localRel);

		const key = img.url;
		if (mediaIndex.byUrl.has(key)) {
			pageMedia.push(mediaIndex.byUrl.get(key));
			continue;
		}

		if (existsSync(localAbs) && mediaIndex.byPath.has(localRel)) {
			const prev = mediaIndex.byPath.get(localRel);
			if (prev.sourceUrl !== key) {
				const ext = extname(filename) || ".jpg";
				const stem = filename.replace(ext, "");
				filename = `${stem}-${contentHash(Buffer.from(key))}${ext}`;
				localAbs = join(MEDIA_DIR, mediaRel, filename);
			}
		}

		const localRelFinal = join(mediaRel, filename).replace(/\\/g, "/");
		try {
			const result = await downloadImage(img.url, join(MEDIA_DIR, localRelFinal));
			const record = {
				sourceUrl: img.url,
				localPath: `scrape/${COUNTRY}/media/${localRelFinal}`,
				alt: img.alt,
				role: img.role,
				entityPath: entry.path,
				downloadOk: result.ok,
				skipped: Boolean(result.skipped),
				status: result.status
			};
			mediaIndex.byUrl.set(key, record);
			mediaIndex.byPath.set(localRelFinal, record);
			mediaIndex.all.push(record);
			pageMedia.push(record);
		} catch (e) {
			const record = {
				sourceUrl: img.url,
				localPath: null,
				alt: img.alt,
				role: img.role,
				entityPath: entry.path,
				downloadOk: false,
				error: String(e.message || e)
			};
			mediaIndex.all.push(record);
			pageMedia.push(record);
		}
	}

	const raw = {
		scrapedAt: new Date().toISOString(),
		url: entry.url,
		path: entry.path,
		locale: entry.locale || "ru",
		status,
		entity,
		title,
		meta,
		headings,
		badges: chips.badges,
		icons: chips.icons,
		themes: chips.themes,
		maps,
		images: pageMedia,
		htmlSaved: false,
		textPreview: headings
			.map((h) => h.text)
			.slice(0, 30)
			.join("\n")
	};

	// Persist HTML for offline re-extract (per locale)
	const htmlRel = entry.path.replace(/^\//, "") + ".html";
	const htmlAbs = join(OUT_ROOT, "html", htmlRel);
	mkdirSync(dirname(htmlAbs), { recursive: true });
	writeFileSync(htmlAbs, html, "utf8");
	raw.htmlFile = `scrape/${COUNTRY}/html/${htmlRel.replace(/\\/g, "/")}`;
	raw.htmlSaved = true;

	const rawRel = entry.path.replace(/^\//, "") + ".json";
	const rawAbs = join(RAW_DIR, rawRel);
	mkdirSync(dirname(rawAbs), { recursive: true });
	writeFileSync(rawAbs, JSON.stringify(raw, null, 2), "utf8");

	return {
		path: entry.path,
		locale: entry.locale || "ru",
		status,
		title,
		entityType: entity.type,
		maps: maps.length,
		markers: maps.reduce((n, m) => n + m.markers.length, 0),
		images: pageMedia.length,
		rawFile: `scrape/${COUNTRY}/raw/${rawRel.replace(/\\/g, "/")}`
	};
}

async function runPool(items, limit, worker) {
	const results = [];
	let i = 0;
	async function next() {
		while (i < items.length) {
			const idx = i++;
			results[idx] = await worker(items[idx], idx);
		}
	}
	await Promise.all(Array.from({ length: limit }, () => next()));
	return results;
}

const urls = LOCALES.flatMap((locale) => loadCountryUrls(locale));
console.error(
	`[${COUNTRY}] pages: ${urls.length} (locales=${LOCALES.join(",")}, only=${ONLY_FILTER || "*"})`
);

const mediaIndex = { byUrl: new Map(), byPath: new Map(), all: [] };
const pages = [];

await runPool(urls, CONCURRENCY, async (entry, idx) => {
	process.stderr.write(`[${idx + 1}/${urls.length}] ${entry.path}\n`);
	try {
		const summary = await scrapePage(entry, mediaIndex);
		pages.push(summary);
		await sleep(80);
		return summary;
	} catch (e) {
		const fail = {
			path: entry.path,
			locale: entry.locale,
			status: "error",
			error: String(e.message || e)
		};
		pages.push(fail);
		return fail;
	}
});

pages.sort((a, b) => a.path.localeCompare(b.path));

const manifest = {
	scrapedAt: new Date().toISOString(),
	origin: ORIGIN,
	locales: LOCALES,
	only: ONLY_FILTER,
	stats: {
		pages: pages.length,
		ok: pages.filter((p) => p.status === 200).length,
		errors: pages.filter((p) => p.status === "error" || p.status !== 200)
			.length,
		media: mediaIndex.all.length,
		mediaOk: mediaIndex.all.filter((m) => m.downloadOk).length,
		withMaps: pages.filter((p) => p.maps > 0).length,
		totalMarkers: pages.reduce((n, p) => n + (p.markers || 0), 0)
	},
	pages
};

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(
	INDEX_PATH,
	JSON.stringify(
		{
			scrapedAt: manifest.scrapedAt,
			locales: LOCALES,
			only: ONLY_FILTER,
			stats: manifest.stats,
			pages: pages.map((p) => ({
				path: p.path,
				locale: p.locale,
				type: p.entityType,
				title: p.title,
				maps: p.maps,
				markers: p.markers,
				images: p.images,
				raw: p.rawFile
			}))
		},
		null,
		2
	),
	"utf8"
);

console.log(
	JSON.stringify(
		{ ok: true, country: COUNTRY, locales: LOCALES, only: ONLY_FILTER, ...manifest.stats },
		null,
		2
	)
);
console.log(`OUT: ${relative(ROOT, OUT_ROOT)}`);
