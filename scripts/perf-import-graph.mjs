/**
 * BFS import graph from one or more entry files.
 * Usage:
 *   node scripts/perf-import-graph.mjs [entry...]
 *   node scripts/perf-import-graph.mjs --name booking --entry path1 --entry path2
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");

const HEAVY = [
	"leaflet",
	"react-leaflet",
	"@tiptap",
	"motion",
	"framer-motion",
	"msw",
	"recharts",
	"chart.js",
	"@dnd-kit"
];

const fromRe =
	/(?:import|export)(?:\s+type)?\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g;
const sideRe = /import\s+["']([^"']+)["']/g;

function parseArgs(argv) {
	const entries = [];
	let name = "graph";
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--name") name = argv[++i];
		else if (a === "--entry") entries.push(argv[++i]);
		else if (!a.startsWith("-")) entries.push(a);
	}
	if (!entries.length) {
		entries.push(
			"src/page/catalog-tour-booking/ui/catalog-tour-booking-page.tsx"
		);
	}
	return { name, entries };
}

function resolveFile(base) {
	const candidates = [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		`${base}.js`,
		`${base}.jsx`,
		path.join(base, "index.ts"),
		path.join(base, "index.tsx"),
		path.join(base, "index.js")
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

function hasUseClient(code) {
	return /^["']use client["']\s*;?/m.test(code.trimStart());
}

function walk(entryPaths) {
	const queue = entryPaths.map((e) => path.resolve(ROOT, e));
	const visited = new Set();
	const clientFiles = new Set();
	const serverishFiles = new Set();
	const heavyHits = [];
	const barrelHits = {
		sharedUi: [],
		customBarrel: [],
		blocksBarrel: []
	};
	const parent = new Map();
	const isClientReachable = new Map();

	for (const start of queue) {
		if (!fs.existsSync(start)) continue;
		const code = fs.readFileSync(start, "utf8");
		isClientReachable.set(start, hasUseClient(code));
	}

	while (queue.length) {
		const file = queue.shift();
		if (!file || visited.has(file) || !fs.existsSync(file)) continue;
		visited.add(file);
		const code = fs.readFileSync(file, "utf8");
		const fileIsClient =
			isClientReachable.get(file) === true || hasUseClient(code);
		if (fileIsClient) clientFiles.add(file);
		else serverishFiles.add(file);

		const rel = path.relative(ROOT, file).replace(/\\/g, "/");

		for (const spec of extractSpecs(code)) {
			for (const h of HEAVY) {
				if (spec === h || spec.startsWith(h + "/")) {
					heavyHits.push({ from: rel, spec });
				}
			}
			if (spec === "@/shared/ui") {
				barrelHits.sharedUi.push(rel);
			}
			if (
				spec === "@/shared/ui/custom" ||
				spec.endsWith("/shared/ui/custom") ||
				spec === "@/shared/ui/custom/index"
			) {
				barrelHits.customBarrel.push(rel);
			}
			if (spec === "@/shared/ui/blocks") {
				barrelHits.blocksBarrel.push(rel);
			}

			if (!spec.startsWith(".") && !spec.startsWith("@/")) continue;
			const resolved = resolveImport(file, spec);
			if (!resolved || visited.has(resolved)) {
				if (resolved && fileIsClient) {
					isClientReachable.set(resolved, true);
				}
				continue;
			}
			parent.set(resolved, { from: file, spec });
			if (fileIsClient || hasUseClient(fs.readFileSync(resolved, "utf8"))) {
				isClientReachable.set(resolved, true);
			} else if (!isClientReachable.has(resolved)) {
				isClientReachable.set(resolved, false);
			}
			queue.push(resolved);
		}
	}

	// Recompute client set via parent chain from entries marked client
	for (const file of visited) {
		let cur = file;
		let client = hasUseClient(fs.readFileSync(file, "utf8"));
		const seen = new Set();
		while (!client && cur && !seen.has(cur)) {
			seen.add(cur);
			const edge = parent.get(cur);
			if (!edge) break;
			cur = edge.from;
			if (cur && hasUseClient(fs.readFileSync(cur, "utf8"))) client = true;
		}
		if (client) {
			clientFiles.add(file);
			serverishFiles.delete(file);
		}
	}

	const files = [...visited].map((f) =>
		path.relative(ROOT, f).replace(/\\/g, "/")
	);

	return {
		moduleCount: visited.size,
		clientModuleCount: clientFiles.size,
		serverishModuleCount: serverishFiles.size,
		files,
		heavySummary: {
			hasSharedUiBarrel: barrelHits.sharedUi.length > 0,
			hasCustomBarrel: barrelHits.customBarrel.length > 0,
			hasBlocksBarrel: barrelHits.blocksBarrel.length > 0,
			hasHandlers: files.some((f) => /\/handlers(\/|\.|$)/.test(f)),
			hasMock: files.some(
				(f) => /\/mock(\/|\.|$)/.test(f) || /\/mock\.ts$/.test(f)
			),
			hasLeaflet: heavyHits.some((h) => /leaflet/.test(h.spec)),
			hasTiptap: heavyHits.some((h) => /@tiptap/.test(h.spec)),
			hasMotion: heavyHits.some(
				(h) =>
					h.spec === "motion" ||
					h.spec.startsWith("motion/") ||
					h.spec.includes("framer-motion")
			),
			hasMsw: heavyHits.some(
				(h) => h.spec === "msw" || h.spec.startsWith("msw/")
			)
		},
		barrelHits,
		heavyHits,
		parent
	};
}

const { name, entries } = parseArgs(process.argv.slice(2));
const result = walk(entries);
const out = {
	name,
	entries,
	moduleCount: result.moduleCount,
	clientModuleCount: result.clientModuleCount,
	serverishModuleCount: result.serverishModuleCount,
	heavySummary: result.heavySummary,
	barrelImportCount: {
		sharedUi: result.barrelHits.sharedUi.length,
		customBarrel: result.barrelHits.customBarrel.length,
		blocksBarrel: result.barrelHits.blocksBarrel.length
	},
	barrelImporters: {
		sharedUi: [...new Set(result.barrelHits.sharedUi)].slice(0, 40),
		customBarrel: [...new Set(result.barrelHits.customBarrel)].slice(0, 20)
	},
	heavyHits: result.heavyHits.slice(0, 50),
	files: result.files
};

if (process.argv.includes("--files")) {
	console.log(JSON.stringify(out, null, 2));
} else {
	const { files, ...summary } = out;
	console.log(JSON.stringify({ ...summary, fileCount: files.length }, null, 2));
	const dumpPath = path.join(ROOT, `.perf-graph-${name}.json`);
	fs.writeFileSync(dumpPath, JSON.stringify(out, null, 2));
	console.error(`wrote ${dumpPath}`);
}
