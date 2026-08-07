/**
 * Diff route graphs: COMMON / HOME_ONLY / CATALOG_ONLY / PREVIEW_ONLY / BOOKING_ONLY
 * Usage: node scripts/perf-graph-diff.mjs
 * Expects .perf-graph-{name}.json dumps with files[].
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function load(name) {
	const p = path.join(ROOT, `.perf-graph-${name}.json`);
	if (!fs.existsSync(p)) return null;
	const data = JSON.parse(fs.readFileSync(p, "utf8"));
	return new Set(data.files || []);
}

function topN(set, n = 30) {
	return [...set].sort().slice(0, n);
}

const home = load("home-page") || load("home-route");
const catalog = load("catalog-page") || load("catalog-route");
const preview = load("preview-page") || load("preview-route");
const booking = load("booking-page") || load("booking-route");

const names = {
	home,
	catalog,
	preview,
	booking
};

const present = Object.entries(names).filter(([, s]) => s);
if (present.length < 2) {
	console.error("Need at least 2 .perf-graph-*-page.json dumps");
	process.exit(1);
}

const allSets = present.map(([, s]) => s);
let common = new Set(allSets[0]);
for (const s of allSets.slice(1)) {
	common = new Set([...common].filter((x) => s.has(x)));
}

function only(target, others) {
	const out = new Set();
	for (const f of target) {
		if (others.every((o) => !o.has(f))) out.add(f);
	}
	return out;
}

const result = {
	sizes: Object.fromEntries(
		present.map(([n, s]) => [n, s.size])
	),
	commonCount: common.size,
	top30Common: topN(common, 30),
	homeOnly: home
		? topN(only(home, [catalog, preview, booking].filter(Boolean)), 40)
		: [],
	catalogOnly: catalog
		? topN(only(catalog, [home, preview, booking].filter(Boolean)), 40)
		: [],
	previewOnly: preview
		? topN(only(preview, [home, catalog, booking].filter(Boolean)), 40)
		: [],
	bookingOnly: booking
		? topN(only(booking, [home, catalog, preview].filter(Boolean)), 40)
		: [],
	commonBarrels: [...common].filter(
		(f) =>
			f.includes("shared/ui/index") ||
			f.includes("shared/ui/custom/index") ||
			f.includes("shared/ui/blocks/index") ||
			f.includes("shared/ui/shadcn-ui/index")
	),
	commonHeavyPaths: [...common].filter((f) =>
		/tiptap|leaflet|motion|msw|custom-editor|animated-beam|handlers|\/mock\//.test(
			f
		)
	)
};

fs.writeFileSync(
	path.join(ROOT, ".perf-graph-diff.json"),
	JSON.stringify(result, null, 2)
);
console.log(JSON.stringify(result, null, 2));
