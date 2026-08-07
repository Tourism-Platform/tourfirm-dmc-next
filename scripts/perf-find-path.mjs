/**
 * Find import path from entry to target substring.
 * Usage: node scripts/perf-find-path.mjs <target> [entry]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const TARGET = process.argv[2] || "animated-beam";
const ENTRY =
	process.argv[3] ||
	"src/page/catalog-tour-booking/ui/catalog-tour-booking-page.tsx";

const fromRe =
	/(?:import|export)(?:\s+type)?\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g;
const sideRe = /import\s+["']([^"']+)["']/g;

function resolveFile(base) {
	const candidates = [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		path.join(base, "index.ts"),
		path.join(base, "index.tsx")
	];
	for (const c of candidates) {
		if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
	}
	return null;
}

function resolveImport(fromFile, spec) {
	if (spec.startsWith("@/")) return resolveFile(path.join(SRC, spec.slice(2)));
	if (spec.startsWith("."))
		return resolveFile(path.resolve(path.dirname(fromFile), spec));
	return null;
}

function extractSpecs(code) {
	const specs = new Set();
	for (const re of [fromRe, sideRe]) {
		re.lastIndex = 0;
		let m;
		while ((m = re.exec(code))) specs.add(m[1]);
	}
	return [...specs];
}

const start = path.resolve(ROOT, ENTRY);
if (!fs.existsSync(start)) {
	console.log(JSON.stringify({ found: false, error: "entry missing", ENTRY }));
	process.exit(1);
}

const parent = new Map();
const queue = [start];
const visited = new Set([start]);
let found = null;

while (queue.length) {
	const file = queue.shift();
	const norm = file.replace(/\\/g, "/");
	if (norm.includes(TARGET) || norm.endsWith(TARGET)) {
		found = file;
		break;
	}
	const code = fs.readFileSync(file, "utf8");
	for (const spec of extractSpecs(code)) {
		if (spec === TARGET || spec.includes(TARGET)) {
			const resolved = resolveImport(file, spec);
			found = resolved || file;
			parent.set(found, { from: file, spec });
			break;
		}
		if (!spec.startsWith(".") && !spec.startsWith("@/")) continue;
		const resolved = resolveImport(file, spec);
		if (resolved && !visited.has(resolved)) {
			visited.add(resolved);
			parent.set(resolved, { from: file, spec });
			queue.push(resolved);
		}
	}
	if (found) break;
}

if (!found) {
	console.log(JSON.stringify({ found: false, visited: visited.size, ENTRY, TARGET }));
	process.exit(0);
}

const chain = [];
let cur = found;
while (cur) {
	const edge = parent.get(cur);
	chain.push({
		file: path.relative(ROOT, cur).replace(/\\/g, "/"),
		via: edge?.spec
	});
	cur = edge?.from;
}
chain.reverse();
console.log(JSON.stringify({ found: true, ENTRY, TARGET, chain }, null, 2));
