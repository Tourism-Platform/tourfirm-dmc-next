import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ORIGIN = "https://tourlink.orientstar.uz";
const START = `${ORIGIN}/ru/travel-info/visa`;
const MAX_PAGES = Number(process.env.MAX_PAGES || 2500);
const LOCALE_FILTER = process.env.LOCALE_FILTER || "ru"; // ru | all
const SKIP_EXT =
	/\.(pdf|jpg|jpeg|png|gif|svg|webp|ico|css|js|woff2?|map|mp4|webm)(\?|$)/i;

const docsDir = join(ROOT, "docs");
const mdPath = join(docsDir, "tourlink-link-tree.md");
const jsonPath = join(docsDir, "tourlink-link-graph.json");

const visited = new Set();
const queue = [];
const pages = new Map();
const external = new Map();
const errors = [];

function normalize(href, base) {
	try {
		if (!href || href.startsWith("javascript:") || href.startsWith("#")) {
			return null;
		}
		if (
			href.startsWith("mailto:") ||
			href.startsWith("tel:") ||
			href.startsWith("sms:")
		) {
			return { kind: "contact", url: href };
		}
		const u = new URL(href, base);
		if (u.protocol !== "http:" && u.protocol !== "https:") {
			return { kind: "other", url: href };
		}
		u.hash = "";
		const path = u.pathname.replace(/\/+$/, "") || "/";
		const abs = u.origin + path + (u.search || "");
		return {
			kind: abs.startsWith(ORIGIN) ? "internal" : "external",
			url: abs
		};
	} catch {
		return null;
	}
}

function isAllowedInternal(url) {
	if (LOCALE_FILTER === "all") return true;
	const path = url.replace(ORIGIN, "") || "/";
	// Prefer /ru/*, allow root hubs without locale only if they redirect into ru later
	if (path === "/" || path === "") return true;
	if (path.startsWith("/ru/") || path === "/ru") return true;
	// Skip en/uz to avoid 3x duplication of destinations tree
	if (path.startsWith("/en/") || path.startsWith("/uz/")) return false;
	if (path.startsWith("/en") || path.startsWith("/uz")) return false;
	// Default-locale destination paths (no prefix) — skip when filtering ru
	if (path.startsWith("/destinations/") || path.startsWith("/about") || path.startsWith("/contact") || path.startsWith("/tours") || path.startsWith("/services") || path.startsWith("/travel-info") || path.startsWith("/legal") || path.startsWith("/journal") || path.startsWith("/company") || path.startsWith("/help") || path.startsWith("/faq") || path.startsWith("/catalog")) {
		return false;
	}
	return true;
}

function extractLinks(html) {
	const links = [];
	const seenHref = new Set();
	const re = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
	let m;
	while ((m = re.exec(html))) {
		const href = m[1];
		const text = m[2]
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 100);
		links.push({ href, text });
		seenHref.add(href);
	}
	const re2 = /href=["']([^"']+)["']/gi;
	let m2;
	while ((m2 = re2.exec(html))) {
		if (!seenHref.has(m2[1])) {
			links.push({ href: m2[1], text: "" });
			seenHref.add(m2[1]);
		}
	}
	const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	return { links, title: titleMatch ? titleMatch[1].trim() : "" };
}

function loadResume() {
	if (!existsSync(jsonPath)) {
		queue.push(START);
		return;
	}
	try {
		const prev = JSON.parse(readFileSync(jsonPath, "utf8"));
		for (const node of prev.nodes || []) {
			pages.set(node.id, {
				status: node.status,
				title: node.title || "",
				outs: node.outs || []
			});
			visited.add(node.id);
		}
		for (const [k, v] of Object.entries(prev.external || {})) {
			external.set(k, new Set(v));
		}
		const discovered = new Set();
		for (const node of prev.nodes || []) {
			for (const out of node.outs || []) {
				if (!visited.has(out) && isAllowedInternal(out)) {
					discovered.add(out);
				}
			}
		}
		queue.push(...[...discovered].sort());
		if (!visited.has(START) && !queue.includes(START)) queue.unshift(START);
		process.stderr.write(
			`Resume: ${visited.size} pages loaded, ${queue.length} queued\n`
		);
	} catch {
		queue.push(START);
	}
}

async function crawl() {
	while (queue.length && visited.size < MAX_PAGES) {
		const url = queue.shift();
		if (visited.has(url)) continue;
		if (!isAllowedInternal(url) && url !== START) {
			visited.add(url);
			pages.set(url, { status: "skipped", title: "", outs: [] });
			continue;
		}
		visited.add(url);
		process.stderr.write(`[${visited.size}/${MAX_PAGES}] ${url}\n`);

		try {
			const resp = await fetch(url, {
				redirect: "follow",
				headers: {
					"User-Agent": "Mozilla/5.0 (compatible; TourLinkSiteMap/1.0)",
					Accept: "text/html",
					"Accept-Language": "ru,en;q=0.9"
				}
			});
			const status = resp.status;
			const finalUrl = (() => {
				const u = new URL(resp.url);
				u.hash = "";
				const p = u.pathname.replace(/\/+$/, "") || "/";
				return u.origin + p + (u.search || "");
			})();
			const ct = resp.headers.get("content-type") || "";
			let title = "";
			const outs = new Set();

			if (ct.includes("text/html")) {
				const html = await resp.text();
				const extracted = extractLinks(html);
				title = extracted.title;
				for (const link of extracted.links) {
					const n = normalize(link.href, finalUrl);
					if (!n) continue;
					if (
						n.kind === "contact" ||
						n.kind === "other" ||
						n.kind === "external"
					) {
						if (!external.has(n.url)) external.set(n.url, new Set());
						if (link.text) external.get(n.url).add(link.text);
						continue;
					}
					if (SKIP_EXT.test(n.url)) continue;
					outs.add(n.url);
					if (
						isAllowedInternal(n.url) &&
						!visited.has(n.url) &&
						!queue.includes(n.url)
					) {
						queue.push(n.url);
					}
				}
			}

			pages.set(finalUrl, { status, title, outs: [...outs].sort() });
			if (finalUrl !== url) {
				pages.set(url, {
					status,
					title,
					outs: [...outs].sort(),
					redirectTo: finalUrl
				});
			}
		} catch (e) {
			pages.set(url, {
				status: "error",
				title: "",
				outs: [],
				error: String(e.message || e)
			});
			errors.push({ url, error: String(e.message || e) });
		}
	}

	return { crawled: visited.size, remaining: queue.length, remainingQueue: [...queue] };
}

function buildSpanningTree(root) {
	const parent = new Map([[root, null]]);
	const children = new Map([[root, []]]);
	const inTree = new Set([root]);
	const q = [root];

	while (q.length) {
		const u = q.shift();
		const page = pages.get(u);
		if (!page) continue;
		for (const v of page.outs) {
			if (!v.startsWith(ORIGIN) || inTree.has(v)) continue;
			if (!isAllowedInternal(v) && v !== root) continue;
			inTree.add(v);
			parent.set(v, u);
			if (!children.has(u)) children.set(u, []);
			children.get(u).push(v);
			if (!children.has(v)) children.set(v, []);
			q.push(v);
		}
	}

	function render(node, prefix, isLast) {
		const lines = [];
		const short = node.replace(ORIGIN, "") || "/";
		const page = pages.get(node);
		const st = page
			? page.status
			: queue.includes(node)
				? "queued"
				: "?";
		const title =
			page && page.title ? ` — ${page.title.replace(/\|/g, "/").replace(/&amp;/g, "&")}` : "";
		const flag = st !== 200 ? ` [${st}]` : "";
		const isRoot = parent.get(node) === null;
		const marker = isRoot ? "" : isLast ? "└── " : "├── ";
		lines.push(`${prefix}${marker}${short}${flag}${title}`);
		const kids = (children.get(node) || []).sort();
		kids.forEach((kid, i) => {
			const last = i === kids.length - 1;
			const nextPrefix = `${prefix}${isRoot ? "" : isLast ? "    " : "│   "}`;
			lines.push(...render(kid, nextPrefix, last));
		});
		return lines;
	}

	return { parent, lines: render(root, "", true) };
}

function buildForestBySection() {
	const bySection = new Map();
	for (const url of [...pages.keys()].sort()) {
		if (!url.startsWith(ORIGIN)) continue;
		if (!isAllowedInternal(url) && url !== START) continue;
		const path = url.replace(ORIGIN, "") || "/";
		const parts = path.split("/").filter(Boolean);
		const locale = parts[0] || "root";
		const section = parts[1] || "(home)";
		const key = `/${locale}/${section}`;
		if (!bySection.has(key)) bySection.set(key, []);
		bySection.get(key).push(path);
	}

	const lines = [];
	for (const [sec, paths] of [...bySection.entries()].sort()) {
		lines.push(sec);
		const uniq = [...new Set(paths)].sort();
		uniq.forEach((p, i) => {
			const last = i === uniq.length - 1;
			const full = ORIGIN + p;
			const pg = pages.get(full);
			const st = pg ? pg.status : "?";
			const flag = st !== 200 && st !== "?" ? ` [${st}]` : "";
			lines.push(`${last ? "└── " : "├── "}${p}${flag}`);
		});
		lines.push("");
	}
	return lines;
}

loadResume();
// Fresh focused crawl if resume was from all-locale run — reset to ru-only seed
if (process.env.FRESH === "1") {
	visited.clear();
	pages.clear();
	external.clear();
	queue.length = 0;
	queue.push(START);
}

const result = await crawl();
const { parent, lines: treeLines } = buildSpanningTree(START);
const sectionLines = buildForestBySection();
const allInternal = [...pages.keys()]
	.filter((u) => u.startsWith(ORIGIN) && (isAllowedInternal(u) || u === START))
	.filter((u) => {
		const p = pages.get(u);
		return p && p.status !== "skipped";
	})
	.sort();

const md = [];
md.push("# TourLink — граф дерева ссылок");
md.push("");
md.push(`Источник обхода: ${START}`);
md.push(`Дата: ${new Date().toISOString()}`);
md.push(`Фильтр локали: ${LOCALE_FILTER}`);
md.push(`Просканировано страниц: ${result.crawled}`);
md.push(`Internal (в отчёте): ${allInternal.length}`);
md.push(`Осталось в очереди: ${result.remaining}`);
md.push(`Внешних/contact URL: ${external.size}`);
md.push("");
md.push("## Spanning tree (BFS от /ru/travel-info/visa)");
md.push("");
md.push("```");
md.push(...treeLines);
md.push("```");
md.push("");
md.push("## Дерево по разделам");
md.push("");
md.push("```");
md.push(...sectionLines);
md.push("```");
md.push("");
md.push("## Полный список internal URL");
md.push("");
for (const u of allInternal) {
	const p = pages.get(u);
	md.push(
		`- ${u}${p && p.status !== 200 ? ` **[${p.status}]**` : ""}${p && p.title ? ` — ${p.title}` : ""}`
	);
}
md.push("");
md.push("## External / contact");
md.push("");
for (const [u, texts] of [...external.entries()].sort()) {
	const t = [...texts].filter(Boolean).slice(0, 3).join(" | ");
	md.push(`- ${u}${t ? ` — ${t}` : ""}`);
}
if (result.remaining > 0) {
	md.push("");
	md.push("## Не обойдены (очередь)");
	md.push("");
	for (const u of result.remainingQueue.slice(0, 500)) {
		md.push(`- ${u}`);
	}
}
if (errors.length) {
	md.push("");
	md.push("## Ошибки");
	md.push("");
	for (const e of errors) {
		md.push(`- ${e.url}: ${e.error}`);
	}
}

const graph = {
	root: START,
	crawledAt: new Date().toISOString(),
	localeFilter: LOCALE_FILTER,
	stats: {
		crawled: result.crawled,
		internalReported: allInternal.length,
		remaining: result.remaining,
		external: external.size
	},
	nodes: allInternal.map((u) => {
		const p = pages.get(u);
		return {
			id: u,
			path: u.replace(ORIGIN, "") || "/",
			status: p?.status,
			title: p?.title || "",
			outs: (p?.outs || []).filter((o) => isAllowedInternal(o) || o === START)
		};
	}),
	edges: allInternal.flatMap((u) => {
		const p = pages.get(u);
		return (p?.outs || [])
			.filter((to) => isAllowedInternal(to) || to === START)
			.map((to) => ({ from: u, to }));
	}),
	spanningTreeParent: Object.fromEntries([...parent.entries()]),
	external: Object.fromEntries(
		[...external.entries()].map(([k, v]) => [k, [...v]])
	),
	remainingQueue: result.remainingQueue
};

mkdirSync(docsDir, { recursive: true });
writeFileSync(mdPath, md.join("\n"), "utf8");
writeFileSync(jsonPath, JSON.stringify(graph, null, 2), "utf8");

console.log(
	JSON.stringify(
		{
			crawled: result.crawled,
			remaining: result.remaining,
			internal: allInternal.length,
			external: external.size,
			treeLines: treeLines.length,
			md: "docs/tourlink-link-tree.md",
			json: "docs/tourlink-link-graph.json"
		},
		null,
		2
	)
);
