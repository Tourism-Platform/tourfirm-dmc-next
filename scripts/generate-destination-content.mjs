/**
 * Generate content YAML from scrape/{country} (multi-locale).
 *
 * Usage:
 *   node scripts/generate-destination-content.mjs --country=kazakhstan
 *   node scripts/generate-destination-content.mjs --country=uzbekistan --only=bukhara
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync
} from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify as yamlStringify } from "yaml";

import {
	extractDestinationPage,
	locMerge
} from "./lib/extract-destination-html.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const ORIGIN = "https://tourlink.orientstar.uz";
const LOCALES = ["ru", "en", "uz"];

/** Optional live→seed region slug remaps per country (TourLink vs CMS). */
const REGION_SLUG_MAPS = {
	uzbekistan: {
		"tashkent-and-chimgan": "tashkent-region",
		samarkand: "samarkand-region",
		bukhara: "bukhara-region",
		khorezm: "khorezm-region"
	}
};

function parseArgs(argv) {
	let only = null;
	let country = null;
	for (const arg of argv) {
		if (arg.startsWith("--only=")) only = arg.slice(7).trim() || null;
		if (arg.startsWith("--country="))
			country = arg.slice(10).trim() || null;
	}
	return { only, country };
}

const { only: ONLY, country: COUNTRY_ARG } = parseArgs(process.argv.slice(2));
const COUNTRY = (COUNTRY_ARG || "uzbekistan").toLowerCase();
const SCRAPE = join(ROOT, "scrape", COUNTRY);
const FALLBACK_IMG = `assets/images/destinations/${COUNTRY}.jpg`;

function regionSeedSlug(live) {
	return REGION_SLUG_MAPS[COUNTRY]?.[live] || live;
}

function cleanTitle(title) {
	return String(title || "")
		.replace(/\s*[|—–-]\s*TourLink.*$/i, "")
		.replace(/\s*,\s*(Узбекистан|Uzbekistan|O['ʻ']zbekiston|Казахстан|Kazakhstan|Қазақстан|Кыргызстан|Kyrgyzstan|Qirgʻiziston|Таджикистан|Tajikistan|Tojikiston|Туркменистан|Turkmenistan|Türkmenistan).*$/i, "")
		.replace(/\s*—\s*(путеводитель|guide|qo['ʻ']llanma).*$/i, "")
		.trim();
}

function canonicalPath(path) {
	return String(path || "").replace(/^\/(ru|en|uz)/, "") || path;
}

function walkJson(dir) {
	const out = [];
	if (!existsSync(dir)) return out;
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) out.push(...walkJson(p));
		else if (name.endsWith(".json")) out.push(p);
	}
	return out;
}

function pickHero(images) {
	const list = images || [];
	return (
		list.find(
			(i) =>
				i.downloadOk &&
				i.localPath &&
				i.role !== "og" &&
				!/tourlink-og-default|logo|favicon/i.test(i.sourceUrl || "")
		) ||
		list.find(
			(i) =>
				i.downloadOk &&
				i.localPath &&
				!/tourlink-og-default|logo|favicon/i.test(i.sourceUrl || "")
		) ||
		null
	);
}

function copyHeroToPublic(hero, entityPathParts) {
	if (!hero?.localPath) return null;
	const absSrc = join(ROOT, hero.localPath);
	if (!existsSync(absSrc)) return null;
	const ext = extname(absSrc) || ".jpg";
	const fileName = `${entityPathParts[entityPathParts.length - 1] || "hero"}${ext}`;
	const relDir = [
		"assets",
		"images",
		"destinations",
		COUNTRY,
		...entityPathParts.slice(0, -1)
	];
	const destAbs = join(ROOT, "public", ...relDir, fileName);
	mkdirSync(dirname(destAbs), { recursive: true });
	copyFileSync(absSrc, destAbs);
	return [...relDir, fileName].join("/");
}

function guessAttractionType(slug, title) {
	const s = `${slug} ${title}`.toLowerCase();
	if (/madras|медресе/.test(s)) return "MADRASA";
	if (/mosque|мечет/.test(s)) return "MOSQUE";
	if (/mausoleum|мавзоле|necropolis/.test(s)) return "MAUSOLEUM";
	if (/fortress|citadel|kala|арк|крепост/.test(s)) return "FORTRESS";
	if (/palace|дворец/.test(s)) return "PALACE";
	if (/bazaar|базар/.test(s)) return "BAZAAR";
	if (/museum|музей/.test(s)) return "MUSEUM";
	if (/park|сад|garden/.test(s)) return "PARK";
	if (/square|площад/.test(s)) return "SQUARE";
	if (/lake|водохран|reservoir|озеро/.test(s)) return "LAKE";
	if (/mountain|peak|горы|chimgan/.test(s)) return "MOUNTAIN";
	if (/viewpoint|смотров/.test(s)) return "VIEWPOINT";
	if (/shrine|complex|мемориал|pilgrim|reliq/.test(s)) return "RELIGIOUS_SITE";
	if (/waterfall|gorge|petroglyph|cave|grotto/.test(s)) return "NATURAL_SITE";
	return "LANDMARK";
}

function writeYaml(filePath, data) {
	mkdirSync(dirname(filePath), { recursive: true });
	writeFileSync(
		filePath,
		`# Generated from scrape/${COUNTRY} (multi-locale)\n${yamlStringify(data, { lineWidth: 0, defaultStringType: "QUOTE_DOUBLE" })}`,
		"utf8"
	);
}

function loadHtml(path) {
	const rel = `${String(path).replace(/^\//, "")}.html`;
	const abs = join(SCRAPE, "html", rel);
	if (existsSync(abs)) return readFileSync(abs, "utf8");
	return null;
}

async function fetchHtml(path) {
	const cached = loadHtml(path);
	if (cached) return cached;
	const resp = await fetch(ORIGIN + path, {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; TourLinkGenerate/1.0)",
			Accept: "text/html"
		}
	});
	return resp.text();
}

function sectionByKind(content, kind, index = 0) {
	const list = (content?.sections || []).filter((s) => s.kind === kind);
	return list[index] || null;
}

function decodeEntities(s) {
	return String(s || "")
		.replace(/&#x27;/gi, "'")
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#x2F;/gi, "/");
}

function cleanPlaceTitle(title) {
	return decodeEntities(title)
		.replace(/,\s*(Бухара|Bukhara|Buxoro)\s*$/i, "")
		.replace(/\s+/g, " ")
		.trim();
}

function L(byLocale, pick) {
	const en = decodeEntities(pick(byLocale.en) || "");
	const ru = decodeEntities(pick(byLocale.ru) || "");
	const uz = decodeEntities(pick(byLocale.uz) || "");
	return locMerge({ en, ru, uz });
}

function defaultZoom(entityType, maps) {
	if (entityType === "country") return 6;
	if (entityType === "city" || entityType === "attraction") return 14;
	if (entityType === "region") return 9;
	return 8;
}

function buildRouteMapBlock({
	byLocale,
	maps,
	stops,
	entityType,
	chrome
}) {
	if (!stops?.length && !maps?.length) return null;
	const map = maps?.[0];
	const markers = map?.markers || [];
	const coords = markers
		.map((m) => m.coordinate)
		.filter((c) => Array.isArray(c) && c.length >= 2);
	const center =
		entityType === "country"
			? { latitude: 41.3775, longitude: 64.5853 }
			: coords.length
				? {
						longitude:
							coords.reduce((s, c) => s + c[0], 0) / coords.length,
						latitude:
							coords.reduce((s, c) => s + c[1], 0) / coords.length
					}
				: { latitude: 41.3, longitude: 64.5 };

	const ruChrome = chrome?.ru || byLocale.ru?.routeMapChrome || {};
	const enChrome = chrome?.en || byLocale.en?.routeMapChrome || {};
	const uzChrome = chrome?.uz || byLocale.uz?.routeMapChrome || {};

	const itinerary = sectionByKind(byLocale.ru, "itinerary");

	const asideItems = (ruChrome.items || []).map((item, idx) => ({
		title: locMerge({
			ru: item.title,
			en: enChrome.items?.[idx]?.title || item.title,
			uz: uzChrome.items?.[idx]?.title || item.title
		}),
		description: locMerge({
			ru: item.description,
			en: enChrome.items?.[idx]?.description || item.description,
			uz: uzChrome.items?.[idx]?.description || item.description
		}),
		...(item.badge || enChrome.items?.[idx]?.badge
			? {
					badge: locMerge({
						ru: item.badge || "",
						en: enChrome.items?.[idx]?.badge || item.badge || "",
						uz: uzChrome.items?.[idx]?.badge || item.badge || ""
					})
				}
			: {})
	}));

	const block = {
		blockType: "routeMap",
		eyebrow: L(
			byLocale,
			(c) => sectionByKind(c, "itinerary")?.eyebrow || "Как перемещаться"
		),
		title: L(byLocale, (c) => sectionByKind(c, "itinerary")?.title),
		description: L(
			byLocale,
			(c) => sectionByKind(c, "itinerary")?.description || ""
		),
		mapPanel: {
			eyebrow: locMerge({
				ru: ruChrome.mapPanel?.eyebrow || "Карта",
				en: enChrome.mapPanel?.eyebrow || "Map",
				uz: uzChrome.mapPanel?.eyebrow || "Xarita"
			}),
			title: locMerge({
				ru: ruChrome.mapPanel?.title || "Маршрут на карте",
				en: enChrome.mapPanel?.title || "Route on the map",
				uz: uzChrome.mapPanel?.title || "Xaritadagi marshrut"
			}),
			description: locMerge({
				ru: ruChrome.mapPanel?.description || "",
				en: enChrome.mapPanel?.description || ruChrome.mapPanel?.description || "",
				uz: uzChrome.mapPanel?.description || ruChrome.mapPanel?.description || ""
			}),
			linkLabel: locMerge({
				en: "Open map",
				ru: "Открыть карту",
				uz: "Xaritani ochish"
			})
		},
		mapCenter: {
			latitude: Number(center.latitude.toFixed(6)),
			longitude: Number(center.longitude.toFixed(6))
		},
		zoom: defaultZoom(entityType, maps),
		stops: stops.slice(0, 40)
	};

	if (ruChrome.aside || asideItems.length) {
		block.aside = {
			eyebrow: locMerge({
				ru: ruChrome.aside?.eyebrow || "Ритм маршрута",
				en: enChrome.aside?.eyebrow || "Route rhythm",
				uz: uzChrome.aside?.eyebrow || "Marshrut ritmi"
			}),
			title: locMerge({
				ru: ruChrome.aside?.title || itinerary?.pairs?.[0]?.title || "",
				en: enChrome.aside?.title || ruChrome.aside?.title || "",
				uz: uzChrome.aside?.title || ruChrome.aside?.title || ""
			}),
			description: locMerge({
				ru: ruChrome.aside?.description || "",
				en: enChrome.aside?.description || ruChrome.aside?.description || "",
				uz: uzChrome.aside?.description || ruChrome.aside?.description || ""
			}),
			items: asideItems
		};
	}

	return block;
}

async function downloadAsset(imageUrl, destRel, { force = false } = {}) {
	if (!imageUrl) return null;
	const destAbs = join(ROOT, "public", destRel);
	mkdirSync(dirname(destAbs), { recursive: true });
	if (!force && existsSync(destAbs) && statSync(destAbs).size > 1000) {
		return destRel.replace(/\\/g, "/");
	}
	try {
		const resp = await fetch(imageUrl, {
			headers: { "User-Agent": "Mozilla/5.0 (compatible; TourLinkGenerate/1.0)" }
		});
		if (!resp.ok) return null;
		const buf = Buffer.from(await resp.arrayBuffer());
		if (buf.length < 500) return null;
		writeFileSync(destAbs, buf);
		return destRel.replace(/\\/g, "/");
	} catch {
		return null;
	}
}

async function buildCharacterPhotoCards(byLocale, slug) {
	const ruCards = byLocale.ru?.characterCards || sectionByKind(byLocale.ru, "character")?.mediaCards || [];
	if (!ruCards.length) return [];
	const enCards = byLocale.en?.characterCards || [];
	const uzCards = byLocale.uz?.characterCards || [];
	const cards = [];
	for (let i = 0; i < ruCards.length; i++) {
		const ru = ruCards[i];
		const en = enCards[i] || {};
		const uz = uzCards[i] || {};
		const imageUrl = ru.imageUrl || "";
		const ext = imageUrl
			? extname(new URL(imageUrl).pathname) || ".webp"
			: ".webp";
		// Unique basename — seed stores media by filename only
		const fileName = `${slug}-character-${i + 1}${ext}`;
		const rel = join(
			"assets",
			"images",
			"destinations",
			COUNTRY,
			"character",
			slug,
			fileName
		).replace(/\\/g, "/");
		let local = null;
		if (imageUrl) {
			const candidates = [
				imageUrl,
				imageUrl.replace(/-\d+x\d+\.(webp|jpg|jpeg|png)$/i, ".$1")
			];
			for (const url of candidates) {
				local = await downloadAsset(url, rel, { force: true });
				if (local) break;
			}
		}
		cards.push({
			type: "experience",
			image: local || FALLBACK_IMG,
			badge: locMerge({
				ru: ru.badge || "",
				en: en.badge || ru.badge || "",
				uz: uz.badge || ru.badge || ""
			}),
			title: locMerge({
				ru: ru.title,
				en: en.title || ru.title,
				uz: uz.title || ru.title
			}),
			description: locMerge({
				ru: ru.description,
				en: en.description || ru.description,
				uz: uz.description || ru.description
			})
		});
	}
	return cards;
}

async function buildNextDestinationCards(byLocale, pageSlug) {
	const ruCards = byLocale.ru?.nextDestinationCards || [];
	if (!ruCards.length) return [];
	const enCards = byLocale.en?.nextDestinationCards || [];
	const uzCards = byLocale.uz?.nextDestinationCards || [];
	const cards = [];
	for (let i = 0; i < ruCards.length; i++) {
		const ru = ruCards[i];
		const en = enCards[i] || {};
		const uz = uzCards[i] || {};
		const citySlug = ru.slug || `next-${i + 1}`;
		const imageUrl = ru.imageUrl || "";
		const ext = imageUrl
			? extname(new URL(imageUrl).pathname) || ".webp"
			: ".webp";
		const fileName = `${pageSlug}-next-${citySlug}${ext}`;
		const rel = join(
			"assets",
			"images",
			"destinations",
			COUNTRY,
			"next",
			fileName
		).replace(/\\/g, "/");
		let local = null;
		if (imageUrl) {
			const candidates = [
				imageUrl,
				imageUrl.replace(/-\d+x\d+\.(webp|jpg|jpeg|png)$/i, ".$1")
			];
			for (const url of candidates) {
				local = await downloadAsset(url, rel, { force: true });
				if (local) break;
			}
		}
		const hrefParts = String(ru.href || "")
			.replace(/^\/(ru|en|uz)/, "")
			.replace(/\/+$/, "")
			.split("/")
			.filter(Boolean);
		// drop "destinations" COUNTRY keep rest
		const pathParts = hrefParts.slice(2);
		cards.push({
			type: "routeIdea",
			image: local || FALLBACK_IMG,
			badge: locMerge({
				ru: "Город",
				en: "City",
				uz: "Shahar"
			}),
			title: locMerge({
				ru: ru.title,
				en: en.title || ru.title,
				uz: uz.title || ru.title
			}),
			description: locMerge({
				ru: ru.description || "",
				en: en.description || ru.description || "",
				uz: uz.description || ru.description || ""
			}),
			ctaHref: `/destinations/${COUNTRY}/${pathParts.join("/")}`,
			ctaLabel: locMerge({
				en: "View",
				ru: "Смотреть",
				uz: "Ko'rish"
			})
		});
	}
	return cards;
}

function mergeInsightCards(byLocale, kind, icon = "MapPin") {
	const ruSection = sectionByKind(byLocale.ru, kind);
	const pairsRu = ruSection?.pairs || [];
	if (!pairsRu.length) return [];

	return pairsRu.map((pair, idx) => {
		const enPair = sectionByKind(byLocale.en, kind)?.pairs?.[idx];
		const uzPair = sectionByKind(byLocale.uz, kind)?.pairs?.[idx];
		return {
			type: "destinationInsight",
			icon,
			title: locMerge({
				ru: pair.title,
				en: enPair?.title || pair.title,
				uz: uzPair?.title || pair.title
			}),
			description: locMerge({
				ru: pair.description,
				en: enPair?.description || pair.description,
				uz: uzPair?.description || pair.description
			})
		};
	});
}

const FACT_ICONS = ["Passport", "Wallet", "ShieldCheck", "Train"];
const SEASON_ICONS = ["Flower2", "Sun", "Leaf", "Snowflake"];

function mergeFactCards(byLocale, kind, icon = "Info") {
	const ruCards = sectionByKind(byLocale.ru, kind)?.factCards || [];
	if (!ruCards.length) return [];
	return ruCards.map((card, idx) => {
		const en = sectionByKind(byLocale.en, kind)?.factCards?.[idx] || {};
		const uz = sectionByKind(byLocale.uz, kind)?.factCards?.[idx] || {};
		const descRu = [card.badge, card.description].filter(Boolean).join("\n\n");
		const descEn = [en.badge || card.badge, en.description || card.description]
			.filter(Boolean)
			.join("\n\n");
		const descUz = [uz.badge || card.badge, uz.description || card.description]
			.filter(Boolean)
			.join("\n\n");
		return {
			type: "destinationInsight",
			icon: FACT_ICONS[idx] || icon,
			title: locMerge({
				ru: card.title,
				en: en.title || card.title,
				uz: uz.title || card.title
			}),
			description: locMerge({
				ru: descRu,
				en: descEn,
				uz: descUz
			})
		};
	});
}

function mergeTripFormatCards(byLocale, kind) {
	const ruCards = sectionByKind(byLocale.ru, kind)?.factCards || [];
	if (!ruCards.length) return [];
	return ruCards.map((card, idx) => {
		const en = sectionByKind(byLocale.en, kind)?.factCards?.[idx] || {};
		const uz = sectionByKind(byLocale.uz, kind)?.factCards?.[idx] || {};
		return {
			type: "tripFormat",
			icon: SEASON_ICONS[idx] || "CalendarDays",
			badge: locMerge({
				ru: card.badge || "",
				en: en.badge || card.badge || "",
				uz: uz.badge || card.badge || ""
			}),
			title: locMerge({
				ru: card.title,
				en: en.title || card.title,
				uz: uz.title || card.title
			}),
			description: locMerge({
				ru: card.description || "",
				en: en.description || card.description || "",
				uz: uz.description || card.description || ""
			})
		};
	});
}

function buildEntityCards(links, heroPathByCanon, badgeDefault, opts = {}) {
	const seen = new Set();
	const cards = [];
	const mustSeeCount = opts.mustSeeCount ?? 0;
	for (const link of links || []) {
		const slug = link.slugParts[link.slugParts.length - 1];
		if (!slug || seen.has(slug)) continue;
		seen.add(slug);
		const canon = canonicalPath(link.href);
		const related = heroPathByCanon.get(canon) || {};
		const idx = cards.length;
		const isMust = idx < mustSeeCount;
		const badge = isMust
			? locMerge({
					ru: "Главное",
					en: "Must see",
					uz: "Asosiy"
				})
			: locMerge({
					ru: badgeDefault.ru,
					en: badgeDefault.en,
					uz: badgeDefault.uz
				});
		cards.push({
			type: "routeIdea",
			image: related.heroPath || FALLBACK_IMG,
			badge,
			title: locMerge({
				ru: cleanPlaceTitle(related.titleRu || slug),
				en: cleanPlaceTitle(related.titleEn || related.titleRu || slug),
				uz: cleanPlaceTitle(related.titleUz || related.titleRu || slug)
			}),
			description: locMerge({
				ru: decodeEntities(related.excerptRu || "").slice(0, 280),
				en: decodeEntities(related.excerptEn || related.excerptRu || "").slice(
					0,
					280
				),
				uz: decodeEntities(related.excerptUz || related.excerptRu || "").slice(
					0,
					280
				)
			}),
			ctaHref: `/destinations/${COUNTRY}/${link.slugParts.join("/")}`,
			ctaLabel: locMerge({
				en: "Open place",
				ru: "Открыть место",
				uz: "Joyni ochish"
			})
		});
	}
	return cards;
}

function buildBlocksFromContent({
	byLocale,
	heroPath,
	maps,
	stops,
	cityCards,
	nextCityCards,
	attractionCards,
	entityType,
	characterCards,
	routeMapChrome,
	regionCards
}) {
	const blocks = [];
	const ru = byLocale.ru || { hero: {}, sections: [] };

	blocks.push({
		blockType: "hero",
		image: heroPath || FALLBACK_IMG,
		imageAlt: L(byLocale, (c) => c?.hero?.title),
		title: L(byLocale, (c) => c?.hero?.title),
		description: L(
			byLocale,
			(c) => c?.hero?.lead || c?.hero?.subtitle || ""
		),
		...(ru.hero?.eyebrow
			? { note: L(byLocale, (c) => c?.hero?.eyebrow) }
			: {})
	});

	const kindsOrder = [];
	for (const s of ru.sections || []) {
		if (!kindsOrder.includes(s.kind)) kindsOrder.push(s.kind);
	}

	for (const kind of kindsOrder) {
		const ruSection = sectionByKind(ru, kind);
		if (!ruSection) continue;

		if (kind === "itinerary") {
			const mapBlock = buildRouteMapBlock({
				byLocale,
				maps,
				stops,
				entityType,
				chrome: routeMapChrome
			});
			if (mapBlock) blocks.push(mapBlock);
			continue;
		}

		// Prep — two-column layout: left flow (dash/quote/alert) + right miniTable
		if (kind === "prep") {
			const ruFlow = ruSection.leftFlow || [];
			const enFlow = sectionByKind(byLocale.en, kind)?.leftFlow || [];
			const uzFlow = sectionByKind(byLocale.uz, kind)?.leftFlow || [];

			const left = [];
			for (let i = 0; i < ruFlow.length; i++) {
				const ruItem = ruFlow[i];
				const enItem = enFlow[i] || {};
				const uzItem = uzFlow[i] || {};

				if (ruItem.type === "quote") {
					left.push({
						type: "quote",
						quote: locMerge({
							ru: ruItem.text,
							en: enItem.text || ruItem.text,
							uz: uzItem.text || ruItem.text
						})
					});
					continue;
				}

				if (ruItem.type === "alert") {
					left.push({
						type: "alert",
						title: locMerge({
							ru: ruItem.title,
							en: enItem.title || ruItem.title,
							uz: uzItem.title || ruItem.title
						}),
						description: locMerge({
							ru: ruItem.description,
							en: enItem.description || ruItem.description,
							uz: uzItem.description || ruItem.description
						})
					});
					continue;
				}

				if (ruItem.type === "dashTitle") {
					left.push({
						type: "dashTitle",
						title: locMerge({
							ru: ruItem.title,
							en: enItem.title || ruItem.title,
							uz: uzItem.title || ruItem.title
						}),
						description: locMerge({
							ru: ruItem.description,
							en: enItem.description || ruItem.description,
							uz: uzItem.description || ruItem.description
						})
					});
				}
			}

			const pairsRu = ruSection.pairs || [];
			const MINI_ICONS = ["MapPin", "Landmark", "Sun", "Route"];
			const miniRows = pairsRu.map((pair, idx) => {
				const enPair = sectionByKind(byLocale.en, kind)?.pairs?.[idx];
				const uzPair = sectionByKind(byLocale.uz, kind)?.pairs?.[idx];
				return {
					icon: MINI_ICONS[idx] || "MapPin",
					title: locMerge({
						ru: pair.title,
						en: enPair?.title || pair.title,
						uz: uzPair?.title || pair.title
					}),
					description: locMerge({
						ru: pair.description,
						en: enPair?.description || pair.description,
						uz: uzPair?.description || pair.description
					})
				};
			});

			const right = miniRows.length
				? [
						{
							type: "miniTable",
							title: L(
								byLocale,
								(c) =>
									sectionByKind(c, kind)?.eyebrow ||
									"Перед поездкой"
							),
							icon: "Circle",
							rows: miniRows
						}
					]
				: [];

			const block = {
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.eyebrow || "Перед поездкой"
				),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				)
			};

			if (left.length || right.length) {
				block.rows = [
					{
						ratio: "2:1",
						left,
						right
					}
				];
			}

			blocks.push(block);
			continue;
		}

		if (kind === "character") {
			const cards =
				characterCards?.length > 0
					? characterCards
					: mergeInsightCards(byLocale, kind, "Compass");
			const description = L(byLocale, (c) => {
				const s = sectionByKind(c, kind);
				if (!s) return "";
				const q = s.quotes?.[0];
				return [s.description, q ? `«${q}»` : ""]
					.filter(Boolean)
					.join("\n\n");
			});
			blocks.push({
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) =>
						sectionByKind(c, kind)?.eyebrow ||
						(entityType === "city" ? "Ритм города" : "Ритм региона")
				),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description,
				...(cards.length
					? {
							gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
							cards
						}
					: {})
			});
			continue;
		}

		if (kind === "facts") {
			const cards = mergeFactCards(byLocale, kind, "Info");
			if (!cards.length) {
				const legacy = mergeInsightCards(byLocale, kind, "Info");
				if (!legacy.length) continue;
				blocks.push({
					blockType: "regular",
					eyebrow: L(
						byLocale,
						(c) => sectionByKind(c, kind)?.eyebrow || "Коротко"
					),
					title: L(
						byLocale,
						(c) =>
							sectionByKind(c, kind)?.title || "Практичные ориентиры"
					),
					description: L(
						byLocale,
						(c) => sectionByKind(c, kind)?.description || ""
					),
					gridClassName: "sm:grid-cols-2 lg:grid-cols-2",
					cards: legacy
				});
				continue;
			}
			blocks.push({
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.eyebrow || "Коротко"
				),
				title: L(
					byLocale,
					(c) =>
						sectionByKind(c, kind)?.title || "Практичные ориентиры"
				),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				),
				gridClassName: "sm:grid-cols-2 lg:grid-cols-4",
				cards
			});
			continue;
		}

		if (kind === "season") {
			const cards = mergeTripFormatCards(byLocale, kind);
			if (!cards.length) continue;
			blocks.push({
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.eyebrow || "Когда ехать"
				),
				title: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.title || "Сезонный ритм"
				),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				),
				gridClassName: "sm:grid-cols-2 lg:grid-cols-4",
				cards
			});
			continue;
		}

		if (kind === "places") {
			const placeCards =
				entityType === "country" && regionCards?.length
					? regionCards
					: cityCards?.length > 0
						? cityCards
						: mergeInsightCards(byLocale, kind, "MapPinned");
			blocks.push({
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) =>
						sectionByKind(c, kind)?.eyebrow ||
						(entityType === "country" ? "Туристические регионы" : "Где начать")
				),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				),
				gridClassName:
					entityType === "country"
						? "sm:grid-cols-2 lg:grid-cols-2"
						: "sm:grid-cols-2 lg:grid-cols-2",
				cards: placeCards
			});
			continue;
		}

		if (kind === "attractions") {
			blocks.push({
				blockType: "regular",
				eyebrow: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.eyebrow || "Что посмотреть"
				),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				),
				gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
				cards:
					attractionCards?.length > 0
						? attractionCards
						: mergeInsightCards(byLocale, kind, "Landmark")
			});
			continue;
		}

		if (kind === "tours") {
			blocks.push({
				blockType: "regular",
				eyebrow: locMerge({
					ru: sectionByKind(byLocale.ru, kind)?.eyebrow || "Программы",
					en: sectionByKind(byLocale.en, kind)?.eyebrow || "Programs",
					uz: sectionByKind(byLocale.uz, kind)?.eyebrow || "Dasturlar"
				}),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				)
			});
			continue;
		}

		if (kind === "next") {
			const nextCards = nextCityCards?.length ? nextCityCards : [];
			blocks.push({
				blockType: "regular",
				eyebrow: locMerge({
					ru: sectionByKind(byLocale.ru, kind)?.eyebrow || "Опорные точки",
					en: sectionByKind(byLocale.en, kind)?.eyebrow || "Anchor points",
					uz: sectionByKind(byLocale.uz, kind)?.eyebrow || "Tayanch nuqtalar"
				}),
				title: L(byLocale, (c) => sectionByKind(c, kind)?.title),
				description: L(
					byLocale,
					(c) => sectionByKind(c, kind)?.description || ""
				),
				...(nextCards.length
					? {
							gridClassName: "sm:grid-cols-2 lg:grid-cols-2",
							cards: nextCards
						}
					: {})
			});
			continue;
		}

		if (kind === "regionCta") {
			const ruCta = byLocale.ru?.regionCta;
			const enCta = byLocale.en?.regionCta;
			const uzCta = byLocale.uz?.regionCta;
			const hrefRaw = (ruCta?.href || enCta?.href || "").trim();
			const label = locMerge({
				ru: ruCta?.label || "Спланировать поездку",
				en: enCta?.label || "Plan a trip",
				uz: uzCta?.label || "Sayohatni rejalashtirish"
			});

			let actions;
			if (/^mailto:/i.test(hrefRaw)) {
				actions = [
					{
						type: "mailto",
						variant: "default",
						title: label,
						email: hrefRaw.replace(/^mailto:/i, "").split("?")[0]
					}
				];
			} else {
				const href = hrefRaw
					.replace(/^\/(ru|en|uz)/, "")
					.replace(
						new RegExp(`^/destinations/${COUNTRY}/([^/]+)$`),
						(_, live) =>
							`/destinations/${COUNTRY}/${regionSeedSlug(live)}`
					);
				actions = [
					{
						type: "link",
						variant: entityType === "country" ? "default" : "outline",
						title: label,
						href:
							href ||
							(entityType === "country"
								? `/destinations/${COUNTRY}`
								: `/destinations/${COUNTRY}`),
						target: "_self"
					}
				];
			}

			blocks.push({
				blockType: "cta",
				eyebrow: locMerge({
					ru: ruCta?.eyebrow || sectionByKind(byLocale.ru, kind)?.eyebrow || "",
					en: enCta?.eyebrow || sectionByKind(byLocale.en, kind)?.eyebrow || "",
					uz: uzCta?.eyebrow || sectionByKind(byLocale.uz, kind)?.eyebrow || ""
				}),
				title: locMerge({
					ru: ruCta?.title || sectionByKind(byLocale.ru, kind)?.title || "",
					en: enCta?.title || sectionByKind(byLocale.en, kind)?.title || "",
					uz: uzCta?.title || sectionByKind(byLocale.uz, kind)?.title || ""
				}),
				description: locMerge({
					ru:
						ruCta?.description ||
						sectionByKind(byLocale.ru, kind)?.description ||
						"",
					en:
						enCta?.description ||
						sectionByKind(byLocale.en, kind)?.description ||
						"",
					uz:
						uzCta?.description ||
						sectionByKind(byLocale.uz, kind)?.description ||
						""
				}),
				actions
			});
			continue;
		}

		// regular — description only, no paragraph dump
		const body = L(
			byLocale,
			(c) => sectionByKind(c, kind)?.description || ""
		);
		if (!body.ru && !body.en) continue;
		blocks.push({
			blockType: "regular",
			eyebrow: L(byLocale, (c) => sectionByKind(c, kind)?.eyebrow || ""),
			title: L(byLocale, (c) => sectionByKind(c, kind)?.title || "Overview"),
			description: body
		});
	}

	const hasMap = blocks.some((b) => b.blockType === "routeMap");
	if (!hasMap && stops?.length) {
		const mapBlock = buildRouteMapBlock({
			byLocale,
			maps,
			stops,
			entityType,
			chrome: routeMapChrome
		});
		if (mapBlock) blocks.splice(Math.min(2, blocks.length), 0, mapBlock);
	}

	return blocks;
}

function normalizeLabel(s) {
	return String(s || "")
		.toLowerCase()
		.replace(/ё/g, "е")
		.replace(/[«»"'`,.]/g, " ")
		.replace(/\b(в|и|на|the|of|and)\b/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/** Fold Cyrillic → Latin for slug/label token compare (no place-name aliases). */
function toLatinFold(s) {
	const map = {
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "e",
		ж: "zh",
		з: "z",
		и: "i",
		й: "y",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "ts",
		ч: "ch",
		ш: "sh",
		щ: "sch",
		ъ: "",
		ы: "y",
		ь: "",
		э: "e",
		ю: "yu",
		я: "ya",
		ў: "o",
		қ: "q",
		ғ: "g",
		ҳ: "h"
	};
	return [...normalizeLabel(s)].map((c) => map[c] ?? c).join("");
}

function labelTokens(s) {
	return toLatinFold(s)
		.split(/[^a-z0-9]+/i)
		.filter((t) => t.length >= 3);
}

/** Generic RU/EN term pairs — not place-name aliases. */
const TERM_SYNONYMS = [
	["museum", "muzey"],
	["preserve", "zapovednik"],
	["mosque", "mechet"],
	["madrasah", "medrese"],
	["mausoleum", "mavzoley"],
	["complex", "kompleks"],
	["citadel", "tsitadel"],
	["palace", "dvorets"],
	["ensemble", "ansambl"],
	["dome", "kupol"],
	["trading", "torgov"]
];

function expandTokens(tokens) {
	const out = new Set(tokens);
	for (const t of tokens) {
		for (const [a, b] of TERM_SYNONYMS) {
			if (t === a || t.includes(a)) out.add(b);
			if (t === b || t.includes(b)) out.add(a);
		}
	}
	return [...out];
}

/** Score marker label against entity title/slug without hardcoded place aliases. */
function scoreEntityMatch(label, title, slug) {
	const lt = expandTokens(labelTokens(label));
	if (!lt.length) return 0;
	const hay = toLatinFold(
		`${title} ${String(slug || "").replace(/-/g, " ")}`
	);
	const ht = expandTokens(labelTokens(hay));
	if (!ht.length) return 0;

	let score = 0;
	for (const t of lt) {
		if (ht.some((h) => h === t || h.includes(t) || t.includes(h))) {
			score += t.length >= 5 ? 2 : 1;
		}
	}
	const labelNorm = toLatinFold(label);
	const titleNorm = toLatinFold(title);
	const slugNorm = toLatinFold(String(slug || "").replace(/-/g, " "));
	if (labelNorm && (labelNorm === titleNorm || labelNorm === slugNorm)) {
		score += 10;
	}
	return score;
}

function matchStopEntity(
	marker,
	cities,
	attractions,
	entityType,
	{ allowCitySelf = false } = {}
) {
	const label = normalizeLabel(marker.label);
	if (!label) return null;

	for (const c of cities) {
		const title = normalizeLabel(c.byLocale?.ru?.hero?.title || c.title);
		const slug = c.entity.city;
		if (label === title || label === slug) {
			if (entityType === "city" && !allowCitySelf) return null;
			return { entityType: "city", entitySlug: slug };
		}
	}

	let best = null;
	let bestScore = 0;
	for (const a of attractions) {
		const title = a.byLocale?.ru?.hero?.title || a.title || "";
		const slug = a.entity.attraction;
		const score = scoreEntityMatch(marker.label, title, slug);
		if (score > bestScore) {
			bestScore = score;
			best = { entityType: "attraction", entitySlug: slug };
		}
	}

	// Require at least one solid token hit (score >= 2) to avoid weak false positives
	if (best && bestScore >= 2) return best;
	return null;
}

// --- load raw pages (ru as entity skeleton) ---
const ruRawDir = join(SCRAPE, "raw", "ru", "destinations", COUNTRY);
const countryJson = join(
	SCRAPE,
	"raw",
	"ru",
	"destinations",
	`${COUNTRY}.json`
);
let files = walkJson(ruRawDir);
if (existsSync(countryJson)) files.unshift(countryJson);

let pages = files.map((f) => JSON.parse(readFileSync(f, "utf8")));

if (ONLY) {
	const needle = ONLY.toLowerCase();
	pages = pages.filter((p) => {
		const region = p.entity?.region;
		if (needle === COUNTRY) return p.entity?.type === "country";
		return region === needle;
	});
}

const byType = { country: [], region: [], city: [], attraction: [] };
for (const p of pages) byType[p.entity?.type]?.push(p);

console.error(
	`Pages(ru): country=${byType.country.length} region=${byType.region.length} city=${byType.city.length} attraction=${byType.attraction.length} only=${ONLY || "*"}`
);

async function enrichPage(p) {
	const byLocale = {};
	const baseCanon = canonicalPath(p.path);

	for (const locale of LOCALES) {
		const localePath =
			locale === "ru"
				? p.path.startsWith("/ru/")
					? p.path
					: `/ru${baseCanon}`
				: `/${locale}${baseCanon}`;
		try {
			const html = await fetchHtml(localePath);
			const extracted = extractDestinationPage(html);
			byLocale[locale] = extracted;
			byLocale[locale].characterCards = extracted.characterCards || [];
			byLocale[locale].routeMapChrome = extracted.routeMapChrome || null;
			byLocale[locale].nextDestinationCards =
				extracted.nextDestinationCards || [];
			byLocale[locale].regionCta = extracted.regionCta || null;
			byLocale[locale].regionCards = extracted.regionCards || [];
		} catch (e) {
			console.error(`  ! ${locale} extract failed ${localePath}: ${e.message}`);
			byLocale[locale] = {
				hero: {},
				sections: [],
				links: { cityLinks: [], attractionLinks: [] },
				characterCards: [],
				routeMapChrome: null,
				nextDestinationCards: [],
				regionCards: [],
				regionCta: null
			};
		}
	}

	p.byLocale = byLocale;
	p.content = byLocale.ru;
	return p;
}

let idx = 0;
for (const p of pages) {
	idx++;
	process.stderr.write(`[extract ${idx}/${pages.length}] ${p.path}\n`);
	await enrichPage(p);
}

const coordByLabel = new Map();
/** "attraction:poi-kalyan-complex" | "city:bukhara" → { lat, lng } from scrape markers */
const coordsByEntityKey = new Map();

for (const p of pages) {
	for (const map of p.maps || []) {
		for (const m of map.markers || []) {
			if (!Array.isArray(m.coordinate) || m.coordinate.length < 2) continue;
			const [lng, lat] = m.coordinate;
			if (m.label) {
				coordByLabel.set(m.label.toLowerCase(), { lat, lng });
				coordByLabel.set(normalizeLabel(m.label), { lat, lng });
			}
		}
	}
}

function markerCoords(marker) {
	const c = marker?.coordinate;
	if (!Array.isArray(c) || c.length < 2) return null;
	return { lat: Number(c[1]), lng: Number(c[0]) };
}

/** Bind scrape map markers → entity keys using the same matcher as routeMap stops. */
function registerEntityCoordsFromMaps() {
	for (const p of pages) {
		const liveRegion = p.entity?.region;
		const pageType = p.entity?.type;
		const citiesHere = byType.city.filter(
			(c) => c.entity.region === liveRegion
		);
		const attractionsHere = byType.attraction.filter((a) => {
			if (pageType === "city") {
				return (
					a.entity.region === liveRegion &&
					a.entity.city === p.entity.city
				);
			}
			return a.entity.region === liveRegion;
		});
		for (const map of p.maps || []) {
			for (const m of map.markers || []) {
				const coords = markerCoords(m);
				if (!coords) continue;
				const matched = matchStopEntity(
					m,
					citiesHere,
					attractionsHere,
					pageType,
					{ allowCitySelf: true }
				);
				if (!matched) continue;
				const key = `${matched.entityType}:${matched.entitySlug}`;
				if (!coordsByEntityKey.has(key)) {
					coordsByEntityKey.set(key, coords);
				}
			}
		}
	}
}

registerEntityCoordsFromMaps();

function findCoords(title, fallback, { slug = "", citySlug = "" } = {}) {
	const keyAttraction = slug ? `attraction:${slug}` : "";
	const keyCity = citySlug ? `city:${citySlug}` : slug ? `city:${slug}` : "";
	if (keyAttraction && coordsByEntityKey.has(keyAttraction)) {
		return coordsByEntityKey.get(keyAttraction);
	}
	if (keyCity && coordsByEntityKey.has(keyCity) && !keyAttraction) {
		return coordsByEntityKey.get(keyCity);
	}

	const t = normalizeLabel(cleanTitle(title));
	if (coordByLabel.has(t)) return coordByLabel.get(t);
	const raw = cleanTitle(title).toLowerCase();
	if (coordByLabel.has(raw)) return coordByLabel.get(raw);

	// Best token overlap against map labels (no hardcoded place-name aliases)
	let best = null;
	let bestScore = 0;
	const probe = `${title} ${slug.replace(/-/g, " ")}`;
	for (const [label, c] of coordByLabel) {
		const score = scoreEntityMatch(label, probe, slug);
		if (score > bestScore) {
			bestScore = score;
			best = c;
		}
	}
	if (best && bestScore >= 2) return best;

	if (keyCity && coordsByEntityKey.has(keyCity)) {
		return coordsByEntityKey.get(keyCity);
	}

	return fallback || { lat: 41.3111, lng: 69.2797 };
}

// Precompute hero public paths for cards
const heroPathByCanon = new Map();
const stats = { countries: 0, regions: 0, cities: 0, attractions: 0, mediaCopied: 0 };

function registerHero(p, type, slug, regionSlug, citySlug) {
	const heroImg = pickHero(p.images);
	const pathParts =
		type === "country"
			? ["country"]
			: type === "region"
				? ["regions", slug]
				: type === "city"
					? ["regions", regionSlug, "cities", slug]
					: [
							"regions",
							regionSlug,
							"cities",
							citySlug,
							"attractions",
							slug
						];
	const heroPath = copyHeroToPublic(heroImg, pathParts);
	if (heroPath) stats.mediaCopied++;
	const canon = canonicalPath(p.path);
	heroPathByCanon.set(canon, {
		heroPath: heroPath || FALLBACK_IMG,
		titleRu: cleanPlaceTitle(
			p.byLocale?.ru?.hero?.title || cleanTitle(p.title)
		),
		titleEn: cleanPlaceTitle(p.byLocale?.en?.hero?.title || ""),
		titleUz: cleanPlaceTitle(p.byLocale?.uz?.hero?.title || ""),
		excerptRu: decodeEntities(
			p.byLocale?.ru?.hero?.lead || p.meta?.description || ""
		),
		excerptEn: decodeEntities(p.byLocale?.en?.hero?.lead || ""),
		excerptUz: decodeEntities(p.byLocale?.uz?.hero?.lead || "")
	});
	return heroPath;
}

for (const p of byType.attraction) {
	registerHero(
		p,
		"attraction",
		p.entity.attraction,
		regionSeedSlug(p.entity.region),
		p.entity.city
	);
}
for (const p of byType.city) {
	registerHero(
		p,
		"city",
		p.entity.city,
		regionSeedSlug(p.entity.region)
	);
}
for (const p of byType.region) {
	registerHero(p, "region", regionSeedSlug(p.entity.region));
}
for (const p of byType.country) {
	registerHero(p, "country", COUNTRY);
}

function entityYaml(p, { slug, regionSlug, citySlug, type }) {
	const byLocale = p.byLocale || { ru: { hero: {}, sections: [] } };
	const title =
		byLocale.ru?.hero?.title || cleanTitle(p.title) || slug;
	const excerpt = byLocale.ru?.hero?.lead || p.meta?.description || "";
	const subtitle = byLocale.ru?.hero?.subtitle || "";
	const heroPath =
		heroPathByCanon.get(canonicalPath(p.path))?.heroPath || FALLBACK_IMG;

	const liveRegion = p.entity?.region;
	const citiesHere = byType.city.filter((c) => c.entity.region === liveRegion);
	const attractionsHere = byType.attraction.filter((a) => {
		if (type === "city") {
			return a.entity.region === liveRegion && a.entity.city === slug;
		}
		return a.entity.region === liveRegion;
	});

	const stops = [];
	const seenStops = new Set();

	if (type === "country") {
		const regionSrc =
			byLocale.ru?.regionCards ||
			sectionByKind(byLocale.ru, "places")?.linkedCards ||
			[];
		for (const card of regionSrc) {
			const liveSlug = card.slug || "";
			if (!liveSlug) continue;
			const entitySlug = regionSeedSlug(liveSlug);
			const key = `region:${entitySlug}`;
			if (seenStops.has(key)) continue;
			seenStops.add(key);
			stops.push({ entityType: "region", entitySlug });
		}
	} else {
		for (const map of p.maps || []) {
			for (const m of map.markers || []) {
				const matched = matchStopEntity(
					m,
					citiesHere,
					attractionsHere,
					type
				);
				if (!matched) continue;
				const key = `${matched.entityType}:${matched.entitySlug}`;
				if (seenStops.has(key)) continue;
				seenStops.add(key);
				stops.push(matched);
			}
		}
		if (!stops.length && type === "region") {
			for (const c of citiesHere)
				stops.push({ entityType: "city", entitySlug: c.entity.city });
		}
		if (!stops.length && type === "city") {
			for (const a of attractionsHere.slice(0, 20)) {
				stops.push({
					entityType: "attraction",
					entitySlug: a.entity.attraction
				});
			}
		}
	}

	const cityCards = buildEntityCards(
		byLocale.ru?.links?.cityLinks || [],
		heroPathByCanon,
		{ ru: "Город", en: "City", uz: "Shahar" }
	);
	const attractionCards = buildEntityCards(
		byLocale.ru?.links?.attractionLinks || [],
		heroPathByCanon,
		{ ru: "Рекомендуем", en: "Recommended", uz: "Tavsiya" },
		{ mustSeeCount: 4 }
	);

	return {
		byLocale,
		title,
		excerpt,
		subtitle,
		heroPath,
		stops,
		cityCards,
		attractionCards,
		type,
		slug,
		regionSlug,
		citySlug
	};
}

async function buildCountryRegionCards(byLocale) {
	const ruCards =
		byLocale.ru?.regionCards ||
		sectionByKind(byLocale.ru, "places")?.linkedCards ||
		[];
	const enCards =
		byLocale.en?.regionCards ||
		sectionByKind(byLocale.en, "places")?.linkedCards ||
		[];
	const uzCards =
		byLocale.uz?.regionCards ||
		sectionByKind(byLocale.uz, "places")?.linkedCards ||
		[];
	const cards = [];
	for (let i = 0; i < ruCards.length; i++) {
		const ru = ruCards[i];
		const en = enCards[i] || {};
		const uz = uzCards[i] || {};
		const liveSlug = ru.slug || `region-${i + 1}`;
		const seedSlug = regionSeedSlug(liveSlug);
		const imageUrl = ru.imageUrl || "";
		const ext = imageUrl
			? extname(new URL(imageUrl).pathname) || ".webp"
			: ".webp";
		const fileName = `region-${seedSlug}${ext}`;
		const rel = join(
			"assets",
			"images",
			"destinations",
			COUNTRY,
			"regions",
			fileName
		).replace(/\\/g, "/");
		let local = null;
		if (imageUrl) {
			const candidates = [
				imageUrl,
				imageUrl.replace(/-\d+x\d+\.(webp|jpg|jpeg|png)$/i, ".$1")
			];
			for (const url of candidates) {
				local = await downloadAsset(url, rel);
				if (local) break;
			}
		}
		cards.push({
			type: "routeIdea",
			image: local || FALLBACK_IMG,
			badge: locMerge({
				ru: "Регион",
				en: "Region",
				uz: "Hudud"
			}),
			title: locMerge({
				ru: ru.title,
				en: en.title || ru.title,
				uz: uz.title || ru.title
			}),
			description: locMerge({
				ru: ru.description || "",
				en: en.description || ru.description || "",
				uz: uz.description || ru.description || ""
			}),
			ctaHref: `/destinations/${COUNTRY}/${seedSlug}`,
			ctaLabel: locMerge({
				en: "View",
				ru: "Смотреть",
				uz: "Ko'rish"
			})
		});
	}
	return cards;
}

async function writeEntityYaml(p, opts) {
	const prepared = entityYaml(p, opts);
	const characterCards = await buildCharacterPhotoCards(
		prepared.byLocale,
		opts.slug
	);
	const nextCityCards = await buildNextDestinationCards(
		prepared.byLocale,
		opts.slug
	);
	const regionCards =
		opts.type === "country"
			? await buildCountryRegionCards(prepared.byLocale)
			: [];
	const routeMapChrome = {
		ru: prepared.byLocale.ru?.routeMapChrome,
		en: prepared.byLocale.en?.routeMapChrome,
		uz: prepared.byLocale.uz?.routeMapChrome
	};

	const blocks = buildBlocksFromContent({
		byLocale: prepared.byLocale,
		heroPath: prepared.heroPath,
		maps: p.maps,
		stops: prepared.stops,
		cityCards: prepared.cityCards,
		nextCityCards,
		attractionCards: prepared.attractionCards,
		entityType: prepared.type,
		characterCards,
		routeMapChrome,
		regionCards
	});

	const coords = findCoords(prepared.title, { lat: 41.3, lng: 64.5 }, {
		slug: opts.slug,
		citySlug:
			opts.type === "attraction"
				? opts.citySlug
				: opts.type === "city"
					? opts.slug
					: ""
	});

	// Country map center from markers if present
	let mapCenter = { latitude: coords.lat, longitude: coords.lng };
	if (opts.type === "country" && p.maps?.[0]?.markers?.length) {
		const markers = p.maps[0].markers;
		const lng =
			markers.reduce((s, m) => s + (m.coordinate?.[0] || 0), 0) /
			markers.length;
		const lat =
			markers.reduce((s, m) => s + (m.coordinate?.[1] || 0), 0) /
			markers.length;
		mapCenter = {
			latitude: Number(lat.toFixed(6)),
			longitude: Number(lng.toFixed(6))
		};
	}

	const base = {
		slug: locMerge({ en: opts.slug, ru: opts.slug, uz: opts.slug }),
		title: L(prepared.byLocale, (c) =>
			cleanPlaceTitle(c?.hero?.title || prepared.title)
		),
		subtitle: L(
			prepared.byLocale,
			(c) => c?.hero?.subtitle || prepared.subtitle
		),
		excerpt: L(
			prepared.byLocale,
			(c) => c?.hero?.lead || prepared.excerpt
		),
		heroImage: prepared.heroPath,
		blocks,
		seo: {
			metaTitle: L(prepared.byLocale, (c) => {
				const t = c?.hero?.title || prepared.title;
				return `${t} | TourLink`;
			}),
			metaDescription: L(
				prepared.byLocale,
				(c) => c?.hero?.lead || prepared.excerpt
			),
			structuredDataType:
				opts.type === "attraction"
					? "TouristAttraction"
					: "TouristDestination"
		},
		status: {
			showInSitemap: true,
			noindex: false,
			hideFromNavigation: false,
			publishedAt: "2026-08-01"
		}
	};

	if (opts.type === "country") {
		return {
			...base,
			mapCenter,
			badges: ["FEATURED", "UNESCO"]
		};
	}
	if (opts.type === "region") {
		return {
			...base,
			country: COUNTRY,
			mapCenter: { latitude: coords.lat, longitude: coords.lng }
		};
	}
	if (opts.type === "city") {
		return {
			...base,
			country: COUNTRY,
			region: opts.regionSlug,
			latitude: coords.lat,
			longitude: coords.lng
		};
	}
	return {
		...base,
		country: COUNTRY,
		region: opts.regionSlug,
		city: opts.citySlug,
		type: guessAttractionType(opts.slug, prepared.title),
		importance: "RECOMMENDED",
		latitude: coords.lat,
		longitude: coords.lng
	};
}

// Write only scoped entities (do not wipe unrelated YAML when --only)
for (const p of byType.country) {
	const slug = p.entity?.country || COUNTRY;
	const data = await writeEntityYaml(p, { slug, type: "country" });
	writeYaml(join(CONTENT, "countries", `${slug}.yml`), data);
	// Compat path used by hubs / themes
	if (data.heroImage) {
		const src = join(ROOT, "public", ...String(data.heroImage).split("/"));
		const dest = join(
			ROOT,
			"public",
			"assets",
			"images",
			"destinations",
			`${COUNTRY}.jpg`
		);
		if (existsSync(src)) {
			mkdirSync(dirname(dest), { recursive: true });
			copyFileSync(src, dest);
		}
	}
	stats.countries++;
}
for (const p of byType.region) {
	const slug = regionSeedSlug(p.entity.region);
	const data = await writeEntityYaml(p, { slug, type: "region" });
	writeYaml(join(CONTENT, "regions", `${slug}.yml`), data);
	stats.regions++;
}
for (const p of byType.city) {
	const slug = p.entity.city;
	const regionSlug = regionSeedSlug(p.entity.region);
	const data = await writeEntityYaml(p, { slug, regionSlug, type: "city" });
	writeYaml(join(CONTENT, "cities", `${slug}.yml`), data);
	stats.cities++;
}
for (const p of byType.attraction) {
	const slug = p.entity.attraction;
	const regionSlug = regionSeedSlug(p.entity.region);
	const citySlug = p.entity.city;
	const data = await writeEntityYaml(p, {
		slug,
		regionSlug,
		citySlug,
		type: "attraction"
	});
	writeYaml(join(CONTENT, "attractions", `${slug}.yml`), data);
	stats.attractions++;
}

console.log(JSON.stringify({ ok: true, country: COUNTRY, only: ONLY, ...stats }, null, 2));
