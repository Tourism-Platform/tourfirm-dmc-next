/**
 * Rank barrel index.ts files by export fan-out and route reachability.
 * Usage: node scripts/perf-barrel-audit.mjs
 * Reads .perf-graph-*.json dumps if present for reachability.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");

const LAYERS = ["shared/ui", "entities", "features", "widgets", "page"];

function walkDir(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name);
		const st = fs.statSync(p);
		if (st.isDirectory()) walkDir(p, out);
		else if (name === "index.ts" || name === "index.tsx") out.push(p);
	}
	return out;
}

const exportStarRe = /export\s+\*\s+from\s+["']([^"']+)["']/g;
const exportNamedRe =
	/export\s+\{[^}]+\}\s+from\s+["']([^"']+)["']/g;

function analyzeBarrel(file) {
	const code = fs.readFileSync(file, "utf8");
	const reexports = [];
	for (const re of [exportStarRe, exportNamedRe]) {
		re.lastIndex = 0;
		let m;
		while ((m = re.exec(code))) reexports.push(m[1]);
	}
	const heavyHints = [];
	const blob = reexports.join(" ") + " " + code;
	for (const hint of [
		"tiptap",
		"editor",
		"leaflet",
		"map",
		"motion",
		"msw",
		"handlers",
		"mock",
		"chart",
		"dnd"
	]) {
		if (blob.toLowerCase().includes(hint)) heavyHints.push(hint);
	}
	return {
		file: path.relative(ROOT, file).replace(/\\/g, "/"),
		reexportCount: reexports.length,
		reexports: reexports.slice(0, 40),
		heavyHints,
		exportStar: (code.match(/export\s+\*\s+from/g) || []).length
	};
}

const barrels = [];
for (const layer of LAYERS) {
	const dir = path.join(SRC, layer);
	for (const f of walkDir(dir)) {
		const a = analyzeBarrel(f);
		if (a.reexportCount > 0 || a.exportStar > 0) barrels.push(a);
	}
}

barrels.sort((a, b) => b.reexportCount - a.reexportCount);

const graphFiles = fs
	.readdirSync(ROOT)
	.filter((f) => f.startsWith(".perf-graph-") && f.endsWith(".json"));

const routeFiles = {};
for (const gf of graphFiles) {
	const data = JSON.parse(fs.readFileSync(path.join(ROOT, gf), "utf8"));
	routeFiles[data.name || gf] = new Set(data.files || []);
}

const ranked = barrels.map((b) => {
	const routes = [];
	for (const [route, files] of Object.entries(routeFiles)) {
		if (files.has(b.file)) routes.push(route);
	}
	let risk = "low";
	if (b.reexportCount >= 15 || b.heavyHints.length >= 2) risk = "high";
	else if (b.reexportCount >= 6 || b.heavyHints.length >= 1) risk = "medium";
	return { ...b, reachableRoutes: routes, risk };
});

const out = {
	barrelCount: ranked.length,
	top: ranked.slice(0, 40),
	highRisk: ranked.filter((b) => b.risk === "high")
};

fs.writeFileSync(
	path.join(ROOT, ".perf-barrel-audit.json"),
	JSON.stringify(out, null, 2)
);
console.log(JSON.stringify(out, null, 2));
