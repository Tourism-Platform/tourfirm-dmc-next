/**
 * Run page + route graphs for all major routes.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const graphScript = path.join(ROOT, "scripts", "perf-import-graph.mjs");

const LAYOUT = [
	"src/widgets/layouts/default/ui/header/header.tsx",
	"src/widgets/layouts/default/ui/footer/ui/footer.tsx"
];

const ROUTES = [
	{
		name: "home",
		page: ["src/page/main/ui/main-page.tsx"]
	},
	{
		name: "catalog",
		page: ["src/page/catalog/ui/catalog-page.tsx"]
	},
	{
		name: "preview",
		page: [
			"src/page/catalog-tour-preview/ui/catalog-tour-preview-page.tsx"
		]
	},
	{
		name: "booking",
		page: [
			"src/page/catalog-tour-booking/ui/catalog-tour-booking-page.tsx"
		]
	},
	{
		name: "login",
		page: ["src/page/login/ui/login-page.tsx"]
	},
	{
		name: "option",
		page: [
			"src/page/catalog-tour-preview/ui/catalog-tour-option-preview-page.tsx"
		]
	}
];

function runGraph(name, entries) {
	const args = [graphScript, "--name", name];
	for (const e of entries) {
		args.push("--entry", e);
	}
	const r = spawnSync(process.execPath, args, {
		cwd: ROOT,
		encoding: "utf8"
	});
	if (r.status !== 0) {
		console.error(r.stderr || r.stdout);
		throw new Error(`graph failed: ${name}`);
	}
	console.log(r.stdout);
	if (r.stderr) console.error(r.stderr);
	const dump = path.join(ROOT, `.perf-graph-${name}.json`);
	return JSON.parse(fs.readFileSync(dump, "utf8"));
}

const matrix = [];

for (const route of ROUTES) {
	const page = runGraph(`${route.name}-page`, route.page);
	const routeGraph = runGraph(`${route.name}-route`, [
		...route.page,
		...LAYOUT
	]);
	matrix.push({
		route: route.name,
		pageModules: page.moduleCount,
		pageClient: page.clientModuleCount,
		routeModules: routeGraph.moduleCount,
		routeClient: routeGraph.clientModuleCount,
		pageHeavy: page.heavySummary,
		routeHeavy: routeGraph.heavySummary,
		pageSharedUiImporters: page.barrelImportCount?.sharedUi ?? 0,
		routeSharedUiImporters: routeGraph.barrelImportCount?.sharedUi ?? 0
	});
}

const outPath = path.join(ROOT, ".perf-route-matrix.json");
fs.writeFileSync(outPath, JSON.stringify({ matrix }, null, 2));
console.log("\n=== MATRIX ===");
console.log(JSON.stringify({ matrix }, null, 2));
console.log(`wrote ${outPath}`);
