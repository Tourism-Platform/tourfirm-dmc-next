/**
 * Extract destination page content from rendered HTML.
 * Classification is by section[id] ({pageType}-{slot}), not page text.
 * Text is used only as field values.
 */

const CDN_IMG_RE = /src="(https:\/\/cdn\.orientstar\.uz\/media\/[^"]+)"/i;
/** Locale prefix optional — EN default locale often omits /en. Any country slug. */
const DEST_HREF_RE =
	/href="(\/(?:(?:ru|en|uz)\/)?destinations\/[^"/]+(?:\/[^"]*)?)"/i;
const DEST_PATH_RE =
	/^\/(?:(?:ru|en|uz)\/)?destinations\/[^/]+(?:\/.*)?$/i;

function parseDestHref(href) {
	const parts = String(href || "")
		.replace(/\/+$/, "")
		.split("/")
		.filter(Boolean);
	const hasLocale = /^(ru|en|uz)$/i.test(parts[0] || "");
	const afterCountry = parts.slice(hasLocale ? 3 : 2);
	return {
		href,
		depth: afterCountry.length,
		slugParts: afterCountry
	};
}

export function stripTags(s) {
	return String(s || "")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#x27;/gi, "'")
		.replace(/&#39;/g, "'")
		.replace(/&#x2F;/gi, "/")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
}

function mainScope(html) {
	const m = String(html || "").match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
	return m ? m[0] : String(html || "");
}

/**
 * Slice a balanced <section ... id="...">...</section> by depth count.
 */
export function sliceSectionById(html, id) {
	if (!html || !id) return null;
	const re = new RegExp(
		`<section\\b([^>]*\\bid="${escapeRegExp(id)}"[^>]*)>`,
		"i"
	);
	const open = re.exec(html);
	if (!open) return null;
	return sliceSectionFromOpen(html, open.index);
}

function sliceSectionFromOpen(html, openIndex) {
	const openTag = html.slice(openIndex).match(/^<section\b[^>]*>/i);
	if (!openTag) return null;
	let i = openIndex + openTag[0].length;
	let depth = 1;
	while (depth > 0 && i < html.length) {
		const rest = html.slice(i);
		const nextOpenRel = rest.search(/<section\b[^>]*>/i);
		const nextCloseRel = rest.search(/<\/section>/i);
		if (nextCloseRel < 0) break;
		const openIdx = nextOpenRel < 0 ? Infinity : i + nextOpenRel;
		const closeIdx = i + nextCloseRel;
		if (openIdx < closeIdx) {
			const tag = html.slice(openIdx).match(/^<section\b[^>]*>/i);
			depth += 1;
			i = openIdx + (tag ? tag[0].length : 8);
		} else {
			depth -= 1;
			i = closeIdx + "</section>".length;
			if (depth === 0) return html.slice(openIndex, i);
		}
	}
	return null;
}

function escapeRegExp(s) {
	return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSection(html, idTest) {
	const sections = listIdSections(html);
	const hit = sections.find((s) => idTest.test(s.id));
	return hit ? hit.html : null;
}

/**
 * Top-level sections that carry destination ids
 * (country-|city-|region-|attraction-).
 */
export function listIdSections(html) {
	const scope = mainScope(html);
	const out = [];
	const re =
		/<section\b([^>]*\bid="((?:country|city|region|attraction)-[^"]+)"[^>]*)>/gi;
	let m;
	while ((m = re.exec(scope))) {
		const id = m[2];
		const sliced = sliceSectionFromOpen(scope, m.index);
		if (sliced) {
			out.push({ id, html: sliced, index: m.index });
			re.lastIndex = m.index + Math.max(sliced.length - 1, 1);
		}
	}
	return out;
}

export function detectPageType(html) {
	const ids = listIdSections(html).map((s) => s.id);
	if (ids.some((id) => id.startsWith("country-"))) return "country";
	if (ids.some((id) => id.startsWith("city-"))) return "city";
	if (ids.some((id) => id.startsWith("region-"))) return "region";
	if (ids.some((id) => id.startsWith("attraction-"))) return "attraction";
	return "unknown";
}

/**
 * Map stable TourLink section ids → generator kinds.
 */
export function idToKind(id) {
	const s = String(id || "");
	if (/-(route-logic|getting-around|getting-there)$/.test(s)) return "itinerary";
	if (
		s === "region-character" ||
		s === "city-experiences" ||
		/-(experiences|character)$/.test(s)
	) {
		return "character";
	}
	if (/^attraction-.+-why$/.test(s)) return "character";
	if (s === "city-practical" || /^attraction-.+-visit-info$/.test(s))
		return "prep";
	if (s === "region-cities" || /-(regions|cities)$/.test(s)) return "places";
	if (s === "region-attractions" || s === "city-attractions")
		return "attractions";
	if (/-(tours)$/.test(s) || s === "region-tours" || s === "city-tours")
		return "tours";
	if (s === "city-nearby" || s === "attraction-nearby") return "next";
	if (/-(country-cta|region-cta|city-cta|request)$/.test(s)) return "regionCta";
	if (/^attraction-.+-what-you-see$/.test(s)) return "regular";
	return "regular";
}

function emptySection(title, eyebrow = null) {
	return {
		title: title || "",
		eyebrow,
		description: null,
		paragraphs: [],
		quotes: [],
		pairs: []
	};
}

/**
 * Header block: .max-w-3xl → eyebrow p, h2, lead p.
 */
export function parseSectionHeader(sectionHtml) {
	const box =
		sectionHtml.match(
			/<div[^>]*class="[^"]*max-w-3xl[^"]*"[^>]*>([\s\S]*?)<\/div>/i
		)?.[1] || sectionHtml.slice(0, 2500);

	const eyebrow = stripTags(
		box.match(
			/<p[^>]*tracking-\[[^\]]+\][^>]*>([\s\S]*?)<\/p>/i
		)?.[1] ||
			box.match(/<p[^>]*text-brand-sky[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
			null
	);
	const title = stripTags(box.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "");
	const lead = stripTags(
		box.match(/<p[^>]*prose-editorial[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""
	);

	const quotes = [
		...sectionHtml.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi)
	]
		.map((m) => stripTags(m[1]))
		.filter(Boolean);

	const paragraphs = [];
	if (lead) paragraphs.push(lead);

	return {
		...emptySection(title || eyebrow || "Section", eyebrow || null),
		description: lead || null,
		paragraphs,
		quotes
	};
}

/**
 * First section without id (data-internal-hero preferred) before id-sections.
 */
export function parseHero(html) {
	const scope = mainScope(html);
	const hero = {
		eyebrow: null,
		title: null,
		subtitle: null,
		lead: null
	};

	const marked = scope.match(
		/<section\b([^>]*data-internal-hero="true"[^>]*)>/i
	);
	let openIndex = marked ? marked.index : -1;

	if (openIndex < 0) {
		const opens = [...scope.matchAll(/<section\b([^>]*)>/gi)];
		const firstId = opens.find((m) => /\bid="/i.test(m[1]));
		const noId = opens.find(
			(m) =>
				!/\bid="/i.test(m[1]) &&
				m.index < (firstId ? firstId.index : Infinity)
		);
		if (!noId) return hero;
		openIndex = noId.index;
	}

	const sliced = sliceSectionFromOpen(scope, openIndex);
	if (!sliced) return hero;

	const eyebrow = stripTags(
		sliced.match(
			/<p[^>]*tracking-\[[^\]]+\][^>]*>([\s\S]*?)<\/p>/i
		)?.[1] || ""
	);
	const title = stripTags(sliced.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
	const ps = [...sliced.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
		.map((m) => stripTags(m[1]))
		.filter((t) => t && t.length > 2);

	const nonEyebrow = ps.filter((t) => t !== eyebrow);
	hero.eyebrow = eyebrow || null;
	hero.title = title || null;
	// Italic / short line under h1 is subtitle; remaining long prose = lead (+ about)
	const italicLike =
		nonEyebrow.find((t) => t.length > 8 && t.length <= 90) || null;
	const longPs = nonEyebrow.filter((t) => t !== italicLike && t.length > 40);
	hero.subtitle = italicLike || nonEyebrow[0] || null;
	hero.lead = longPs.length ? longPs.join("\n\n") : nonEyebrow[1] || null;
	return hero;
}

export function parseRouteMapChrome(sectionHtml) {
	const result = {
		aside: null,
		mapPanel: null,
		items: []
	};
	if (!sectionHtml) return result;

	const aside = sectionHtml.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/i)?.[0];
	if (aside) {
		const headerBox = aside.match(
			/<div[^>]*class="[^"]*min-w-0[^"]*"[^>]*>([\s\S]*?)<\/div>/i
		)?.[1];
		const src = headerBox || aside.slice(0, 1200);
		const eyebrow = stripTags(
			src.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""
		);
		const title = stripTags(src.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || "");
		const afterH3 = src.slice(src.search(/<\/h3>/i) + 5);
		const description = stripTags(
			afterH3.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""
		);
		if (eyebrow || title) {
			result.aside = {
				eyebrow: eyebrow || null,
				title: title || null,
				description: description || null
			};
		}

		const detailsRe = /<details\b[\s\S]*?<\/details>/gi;
		let dm;
		while ((dm = detailsRe.exec(aside))) {
			const block = dm[0];
			const summaryMatch = /<summary\b[\s\S]*?>([\s\S]*?)<\/summary>/i.exec(
				block
			);
			if (!summaryMatch) continue;
			const summaryInner = summaryMatch[1];
			const afterSummary = block.slice(
				summaryMatch.index + summaryMatch[0].length
			);

			const titleSpan =
				/<span[^>]*min-w-0[^>]*font-semibold[^>]*>([\s\S]*?)<\/span>/i.exec(
					summaryInner
				) ||
				/<span[^>]*font-semibold[^>]*leading-snug[^>]*>([\s\S]*?)<\/span>/i.exec(
					summaryInner
				) ||
				/<span[^>]*text-base[^>]*font-semibold[^>]*>([\s\S]*?)<\/span>/i.exec(
					summaryInner
				);

			let titleText = titleSpan ? stripTags(titleSpan[1]) : "";
			if (!titleText || /^\d+$/.test(titleText)) {
				const spans = [
					...summaryInner.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)
				]
					.map((x) => stripTags(x[1]))
					.filter((t) => t && !/^\d+$/.test(t) && t.length > 3);
				titleText = spans[0] || "";
			}
			if (!titleText || titleText.length < 3) continue;

			const bodyPs = [
				...afterSummary.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)
			].map((x) => stripTags(x[1]));
			const badge = bodyPs.find((t) => t && t.length <= 55) || null;
			const descriptionText =
				bodyPs.find((t) => t && t.length > 40 && t !== badge) ||
				bodyPs.find((t) => t && t !== badge) ||
				"";

			// Structural: itinerary/stop details need a body, not bare nav labels
			if (!descriptionText || descriptionText.length < 20) continue;
			result.items.push({
				title: titleText,
				description: descriptionText,
				badge
			});
		}
	}

	const panelMatch = sectionHtml.match(
		/<div[^>]*class="[^"]*rounded-lg[^"]*border[^"]*bg-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div|<\/div>)/i
	);
	const panelSrc =
		sectionHtml.match(
			/<div[^>]*class="[^"]*bg-card[^"]*"[^>]*>[\s\S]{0,2000}/i
		)?.[0] || panelMatch?.[0];
	if (panelSrc) {
		const eyebrow = stripTags(
			panelSrc.match(/<p[^>]*tracking-\[[^\]]+\][^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				panelSrc.match(/<p[^>]*text-brand-sky[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				panelSrc.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				""
		);
		const title = stripTags(
			panelSrc.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || ""
		);
		const afterH3 = panelSrc.slice(panelSrc.search(/<\/h3>/i) + 5);
		const description = stripTags(
			afterH3.match(/<p[^>]*prose-editorial[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				afterH3.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				""
		);
		if (eyebrow || title) {
			result.mapPanel = {
				eyebrow: eyebrow || null,
				title: title || null,
				description: description || null
			};
		}
	}

	return result;
}

export function parseExperienceCards(sectionHtml) {
	if (!sectionHtml) return [];
	const cards = [];
	const seen = new Set();
	const articles = [...sectionHtml.matchAll(/<article\b[\s\S]*?<\/article>/gi)];
	for (const m of articles) {
		const block = m[0];
		const imageUrl = block.match(CDN_IMG_RE)?.[1] || null;
		const badge = stripTags(
			block.match(/<p[^>]*rounded-full[^>]*>([\s\S]*?)<\/p>/i)?.[1] || ""
		);
		const title = stripTags(block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || "");
		const ps = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((x) =>
			stripTags(x[1])
		);
		const description =
			ps.find((t) => t && t !== badge && t.length > 30) ||
			ps.find((t) => t && t !== badge) ||
			"";
		if (!title || seen.has(title)) continue;
		seen.add(title);
		cards.push({
			imageUrl,
			badge: badge || null,
			title,
			description
		});
	}
	return cards;
}

export function parseLinkedCards(sectionHtml) {
	if (!sectionHtml) return [];
	const cards = [];
	const seen = new Set();
	const linkRe =
		/<a\b([^>]*href="\/(?:(?:ru|en|uz)\/)?destinations\/[^"/]+(?:\/[^"]*)?"[^>]*)>([\s\S]*?)<\/a>/gi;
	let m;
	while ((m = linkRe.exec(sectionHtml))) {
		const attrs = m[1];
		const inner = m[2];
		if (!/<article\b/i.test(inner)) continue;
		const href = attrs.match(DEST_HREF_RE)?.[1];
		if (!href || seen.has(href)) continue;
		seen.add(href);
		const { slugParts } = parseDestHref(href);
		const slug = slugParts[slugParts.length - 1] || "";
		const imageUrl = inner.match(CDN_IMG_RE)?.[1] || null;
		const title = stripTags(inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || "");
		const description = stripTags(
			inner.match(/<p[^>]*prose-editorial[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				[...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
					.map((x) => stripTags(x[1]))
					.find((t) => t && t.length > 40) ||
				""
		);
		cards.push({ href, slug, imageUrl, title, description });
	}
	return cards;
}

/**
 * Practical / prep section: aside fact pairs + left column flow
 * (dash titles, quote, traveler alert) in DOM order — by tags/structure.
 */
export function parsePracticalPairs(sectionHtml) {
	if (!sectionHtml) {
		return { pairs: [], quotes: [], leftFlow: [], alert: null };
	}

	const asideStart = sectionHtml.search(/<aside\b/i);
	const leftHtml =
		asideStart >= 0 ? sectionHtml.slice(0, asideStart) : sectionHtml;
	const aside =
		asideStart >= 0
			? sectionHtml.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/i)?.[0] || ""
			: "";

	const pairs = [];
	const pairRe =
		/<p\b[^>]*\bfont-display\b[^>]*>([\s\S]*?)<\/p>\s*<p\b[^>]*\bprose-editorial\b[^>]*>([\s\S]*?)<\/p>/gi;
	let m;
	while ((m = pairRe.exec(aside))) {
		const title = stripTags(m[1]);
		const description = stripTags(m[2]);
		if (title && description) pairs.push({ title, description });
	}

	// Prefer content column if present; skip section header (max-w-3xl)
	const colMatch = leftHtml.match(
		/<div\b[^>]*\bmax-w-\[68ch\]\b[^>]*>([\s\S]*)/i
	);
	const flowSrc = colMatch?.[1] || leftHtml;

	const leftFlow = [];
	const quotes = [];
	const seenTitles = new Set();

	// quote | callout (relative + absolute left bar) | dash title (flex+gap row + prose)
	const tokenRe =
		/<blockquote\b[\s\S]*?<\/blockquote>|<div\b[^>]*\brelative\b[^>]*>[\s\S]*?<span\b[^>]*\babsolute\b[^>]*\bleft-0\b[^>]*>[\s\S]*?<\/div>|<p\b[^>]*\bflex\b[^>]*\bitems-center\b[^>]*\bgap-3\b[^>]*>[\s\S]*?<\/p>\s*<p\b[^>]*\bprose-editorial\b[^>]*>[\s\S]*?<\/p>/gi;

	let token;
	while ((token = tokenRe.exec(flowSrc))) {
		const block = token[0];

		if (/^<blockquote/i.test(block)) {
			const text = stripTags(block);
			if (text) {
				quotes.push(text);
				leftFlow.push({ type: "quote", text });
			}
			continue;
		}

		if (/^<div\b/i.test(block) && /\babsolute\b/.test(block)) {
			const title = stripTags(
				block.match(
					/<p\b[^>]*\bfont-display\b[^>]*>([\s\S]*?)<\/p>/i
				)?.[1] ||
					block.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
					""
			);
			const description = stripTags(
				block.match(/<p\b[^>]*\bprose-editorial\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
					""
			);
			if (title && description) {
				leftFlow.push({ type: "alert", title, description });
			}
			continue;
		}

		const title = stripTags(
			block.match(/<p\b[^>]*>[\s\S]*?<\/p>/i)?.[0] || ""
		).replace(/^[\s—–-]+/, "");
		const description = stripTags(
			block.match(/<p\b[^>]*\bprose-editorial\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
				""
		);
		if (!title || !description) continue;
		if (seenTitles.has(title)) continue;
		seenTitles.add(title);
		leftFlow.push({ type: "dashTitle", title, description });
	}

	const alert = leftFlow.find((x) => x.type === "alert") || null;

	return { pairs, quotes, leftFlow, alert };
}

export function parseCta(sectionHtml) {
	if (!sectionHtml) return null;
	const shell =
		sectionHtml.match(
			/<div[^>]*relative isolate[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i
		)?.[0] || sectionHtml;

	const eyebrow = stripTags(
		shell.match(
			/<p[^>]*tracking-\[[^\]]+\][^>]*text-brand-sky[^>]*>([\s\S]*?)<\/p>/i
		)?.[1] ||
			shell.match(/<p[^>]*text-brand-sky[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
			shell.match(/<p[^>]*tracking-\[[^\]]+\][^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
			""
	);
	const title = stripTags(shell.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "");
	const description = stripTags(
		shell.match(/<p[^>]*prose-editorial[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
			shell.match(/<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ||
			""
	);
	const link =
		shell.match(
			/<a\b[^>]*href="(mailto:[^"]+|\/(?:(?:ru|en|uz)\/)?(?:destinations|routes|experiences)[^"]*)"[^>]*>([\s\S]*?)<\/a>/i
		) ||
		shell.match(
			/<a\b[^>]*href="(\/(?:(?:ru|en|uz)\/)?destinations\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/i
		);
	if (!title && !link) return null;
	return {
		eyebrow: eyebrow || null,
		title: title || null,
		description: description || null,
		href: link?.[1] || null,
		label: link
			? stripTags(link[2]).replace(/\s+/g, " ").trim()
			: null
	};
}

function parseDestinationLinks(scopeHtml) {
	const links = [];
	const seen = new Set();
	const re =
		/<a\b[^>]*href="(\/(?:(?:ru|en|uz)\/)?destinations\/[^"/]+(?:\/[^"]*)?)"[^>]*>([\s\S]*?)<\/a>/gi;
	let m;
	while ((m = re.exec(scopeHtml))) {
		const href = m[1];
		if (!DEST_PATH_RE.test(href) || seen.has(href)) continue;
		seen.add(href);
		const text = stripTags(m[2]);
		const { depth, slugParts } = parseDestHref(href);
		if (!slugParts.length && depth === 0) continue;
		links.push({
			href,
			text,
			depth,
			slugParts
		});
	}
	return links;
}

/** Chip badges from rounded-full elements (DOM), not locale word lists. */
function extractBadgesNear(scopeHtml) {
	const badges = [
		...scopeHtml.matchAll(/<p\b[^>]*\brounded-full\b[^>]*>([\s\S]*?)<\/p>/gi)
	]
		.map((m) => stripTags(m[1]))
		.filter((t) => t && t.length <= 40);
	return [...new Set(badges)];
}

function buildFlow(scopeHtml) {
	const flow = [];
	const re = /<(h[1-3]|p|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
	let m;
	while ((m = re.exec(scopeHtml))) {
		const text = stripTags(m[2]);
		if (!text || text.length < 2) continue;
		flow.push({ tag: m[1].toLowerCase(), text });
	}
	return flow;
}

/** Public wrappers — ID-scoped. */
export function extractCharacterMediaCards(html) {
	const section = findSection(
		html,
		/^(city-experiences|region-character|country-experiences)$|-(experiences|character)$|^attraction-.+-why$/
	);
	return parseExperienceCards(section);
}

export function extractRouteMapChrome(html) {
	const section = findSection(
		html,
		/-(route-logic|getting-around|getting-there)$/
	);
	return parseRouteMapChrome(section);
}

export function extractNextDestinationCards(html) {
	const section = findSection(html, /-(nearby|cities)$/);
	return parseLinkedCards(section);
}

export function extractRegionCta(html) {
	const section = findSection(
		html,
		/-(country-cta|region-cta|city-cta|request)$/
	);
	return parseCta(section);
}

/**
 * Sections without id (except hero): seasons / practical on country pages.
 */
export function listAnonymousSections(html) {
	const scope = mainScope(html);
	const out = [];
	const re = /<section\b([^>]*)>/gi;
	let m;
	while ((m = re.exec(scope))) {
		const attrs = m[1];
		if (/\bid="/i.test(attrs)) continue;
		if (/data-internal-hero/i.test(attrs)) continue;
		const sliced = sliceSectionFromOpen(scope, m.index);
		if (!sliced || !/<h2\b/i.test(sliced)) continue;
		out.push({ html: sliced, index: m.index });
		re.lastIndex = m.index + Math.max(sliced.length - 1, 1);
	}
	return out;
}

/** Structural: month-range short line → season; otherwise facts. */
export function classifyAnonymousSection(sectionHtml) {
	const articles = [
		...sectionHtml.matchAll(/<article\b[\s\S]*?<\/article>/gi)
	];
	if (articles.length < 3) return null;
	const first = articles[0][0];
	const ps = [...first.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((x) =>
		stripTags(x[1])
	);
	const hasRange = ps.some(
		(t) =>
			t.length > 0 &&
			t.length <= 40 &&
			/[–—-]/.test(t) &&
			!/[.]/.test(t)
	);
	return hasRange ? "season" : "facts";
}

export function parseArticleFactCards(sectionHtml) {
	if (!sectionHtml) return [];
	const cards = [];
	for (const m of sectionHtml.matchAll(/<article\b[\s\S]*?<\/article>/gi)) {
		const block = m[0];
		const title = stripTags(
			block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || ""
		);
		const ps = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((x) =>
			stripTags(x[1])
		);
		const badge = ps.find((t) => t && t.length <= 40) || null;
		const description =
			ps.find((t) => t && t !== badge && t.length > 20) ||
			ps.find((t) => t && t !== badge) ||
			"";
		if (!title) continue;
		cards.push({ title, badge, description });
	}
	return cards;
}

export function extractDestinationPage(html) {
	const scope = mainScope(html);
	const idSections = listIdSections(html);
	const hero = parseHero(html);

	const characterCards = extractCharacterMediaCards(html);
	const routeMapChrome = extractRouteMapChrome(html);
	const nextDestinationCards = extractNextDestinationCards(html);
	const regionCta = extractRegionCta(html);
	const regionCards = parseLinkedCards(
		findSection(html, /-(regions|cities)$/) || ""
	);

	const contentScope = [
		sliceSectionFromOpen(
			scope,
			scope.search(/<section\b(?![^>]*\bid=)[^>]*>/i)
		) || "",
		...idSections.map((s) => s.html)
	].join("\n");

	const links = parseDestinationLinks(contentScope);
	const pageBadges = extractBadgesNear(contentScope);
	const flow = buildFlow(contentScope);

	const sections = idSections.map(({ id, html: sectionHtml, index }) => {
		const kind = idToKind(id);
		const base = parseSectionHeader(sectionHtml);

		if (kind === "prep") {
			const { pairs, quotes, leftFlow, alert } =
				parsePracticalPairs(sectionHtml);
			base.pairs = pairs;
			if (quotes.length) base.quotes = quotes;
			base.leftFlow = leftFlow || [];
			base.alert = alert || null;
		}

		if (kind === "attractions" || kind === "places" || kind === "next") {
			const cards = parseLinkedCards(sectionHtml);
			base.pairs = cards.map((c) => ({
				title: c.title,
				description: c.description
			}));
			base.linkedCards = cards;
		}

		if (kind === "character" && characterCards.length) {
			base.mediaCards = characterCards;
		}
		if (kind === "itinerary") {
			base.routeMapChrome = routeMapChrome;
		}
		if (kind === "next" && nextDestinationCards.length) {
			base.nextCards = nextDestinationCards;
		}
		if (kind === "regionCta" && regionCta) {
			base.regionCta = regionCta;
		}

		return { ...base, kind, sectionId: id, index };
	});

	// Country seasons / practical — sections without id, classified by structure
	for (const anon of listAnonymousSections(html)) {
		const kind = classifyAnonymousSection(anon.html);
		if (!kind) continue;
		const base = parseSectionHeader(anon.html);
		base.factCards = parseArticleFactCards(anon.html);
		sections.push({
			...base,
			kind,
			sectionId: null,
			index: anon.index
		});
	}

	sections.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

	const cityLinks = links.filter((l) => l.depth === 2);
	const attractionLinks = links.filter((l) => l.depth >= 3);

	return {
		hero,
		sections,
		links: { cityLinks, attractionLinks, all: links },
		pageBadges,
		characterCards,
		routeMapChrome,
		nextDestinationCards,
		regionCards,
		regionCta,
		flow
	};
}

/** Same text in all locales (fallback only). */
export function loc3(text) {
	const t = text || "";
	return { en: t, ru: t, uz: t };
}

/** Merge per-locale strings with fallback chain. */
export function locMerge({ en = "", ru = "", uz = "" } = {}) {
	return {
		en: en || ru || uz || "",
		ru: ru || en || uz || "",
		uz: uz || ru || en || ""
	};
}
