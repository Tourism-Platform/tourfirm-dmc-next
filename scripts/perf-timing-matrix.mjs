/**
 * Multi-route cold×3 + repeat×3 timing matrix.
 * Usage: node scripts/perf-timing-matrix.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 3030;
const HOST = "127.0.0.1";
const TOUR = "30fdf8f0-4336-4cbf-a7e6-fb698d65a9d2";
const LOG = path.join(ROOT, ".perf-timing-server.log");
const OUT = path.join(ROOT, ".perf-timing-results.json");

const ROUTES = [
	{
		id: "home",
		path: "/en",
		matchFn: (l) => /GET \/en 200/.test(l) && !/GET \/en\//.test(l)
	},
	{
		id: "catalog",
		path: "/en/catalog",
		matchFn: (l) => /GET \/en\/catalog 200/.test(l)
	},
	{
		id: "preview",
		path: `/en/catalog/${TOUR}`,
		matchFn: (l) =>
			l.includes(`GET /en/catalog/${TOUR} 200`) && !l.includes("/booking")
	},
	{
		id: "booking",
		path: `/en/catalog/${TOUR}/booking`,
		matchFn: (l) => l.includes(`GET /en/catalog/${TOUR}/booking 200`)
	}
];

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function rmDev() {
	const p = path.join(ROOT, ".next", "dev");
	if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function killTree(child) {
	if (!child?.pid) return;
	try {
		if (process.platform === "win32") {
			spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
				stdio: "ignore"
			});
		} else {
			child.kill("SIGKILL");
		}
	} catch {
		/* ignore */
	}
}

async function startServer() {
	if (fs.existsSync(LOG)) fs.unlinkSync(LOG);
	const logFd = fs.openSync(LOG, "a");
	const child = spawn(
		"npx",
		["next", "dev", "-H", HOST, "-p", String(PORT)],
		{
			cwd: ROOT,
			env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
			stdio: ["ignore", logFd, logFd],
			shell: true
		}
	);
	const t0 = Date.now();
	while (Date.now() - t0 < 120000) {
		const text = fs.existsSync(LOG) ? fs.readFileSync(LOG, "utf8") : "";
		if (text.includes("Ready in")) return child;
		if (child.exitCode != null) throw new Error("server exited early");
		await sleep(500);
	}
	killTree(child);
	throw new Error("server ready timeout");
}

function parseTiming(line) {
	const total =
		line.match(/GET .+? (\d+(?:\.\d+)?(?:ms|s|min))/)?.[1] ?? null;
	const next = line.match(/next\.js: ([^,\)]+)/)?.[1] ?? null;
	const app = line.match(/application-code: ([^,\)]+)/)?.[1] ?? null;
	const proxy = line.match(/proxy\.ts: ([^,\)]+)/)?.[1] ?? null;
	return { raw: line.trim(), total, next, app, proxy };
}

function fireAndWait(pathname, matchFn, maxMs = 900000) {
	const startSize = fs.existsSync(LOG)
		? fs.readFileSync(LOG, "utf8").length
		: 0;
	const url = `http://${HOST}:${PORT}${pathname}`;
	const t0 = Date.now();
	const req = http.get(url, { timeout: maxMs }, (res) => {
		res.resume();
	});
	req.on("error", () => {});
	req.on("timeout", () => req.destroy());

	return new Promise((resolve, reject) => {
		const timer = setInterval(() => {
			const text = fs.readFileSync(LOG, "utf8").slice(startSize);
			const line = text
				.split(/\r?\n/)
				.find(
					(l) =>
						l.includes("GET ") &&
						l.includes("application-code") &&
						matchFn(l)
				);
			if (line) {
				clearInterval(timer);
				resolve({ ...parseTiming(line), elapsedMs: Date.now() - t0 });
			} else if (Date.now() - t0 > maxMs) {
				clearInterval(timer);
				reject(new Error(`timeout waiting ${pathname}`));
			}
		}, 1000);
	});
}

function toMs(label) {
	if (!label) return null;
	if (label.endsWith("min")) return parseFloat(label) * 60000;
	if (label.endsWith("s") && !label.endsWith("ms"))
		return parseFloat(label) * 1000;
	if (label.endsWith("ms")) return parseFloat(label);
	return null;
}

function median(vals) {
	const s = vals.filter((v) => v != null).sort((a, b) => a - b);
	if (!s.length) return null;
	const m = Math.floor(s.length / 2);
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

async function measureRoute(route) {
	const cold = [];
	for (let i = 1; i <= 3; i++) {
		console.log(`\n=== COLD ${route.id} #${i} ===`);
		rmDev();
		const child = await startServer();
		try {
			const r = await fireAndWait(route.path, route.matchFn);
			console.log(JSON.stringify(r));
			cold.push(r);
		} finally {
			killTree(child);
			await sleep(3000);
		}
	}

	console.log(`\n=== REPEAT setup ${route.id} ===`);
	rmDev();
	const child = await startServer();
	const repeat = [];
	try {
		console.log(`=== PRIME ${route.id} ===`);
		await fireAndWait(route.path, route.matchFn);
		for (let i = 1; i <= 3; i++) {
			console.log(`\n=== REPEAT ${route.id} #${i} ===`);
			const r = await fireAndWait(route.path, route.matchFn);
			console.log(JSON.stringify(r));
			repeat.push(r);
		}
	} finally {
		killTree(child);
		await sleep(3000);
	}

	return {
		cold,
		repeat,
		medians: {
			coldTotalMs: median(cold.map((r) => toMs(r.total))),
			coldNextMs: median(cold.map((r) => toMs(r.next))),
			coldAppMs: median(cold.map((r) => toMs(r.app))),
			repeatTotalMs: median(repeat.map((r) => toMs(r.total))),
			repeatNextMs: median(repeat.map((r) => toMs(r.next))),
			repeatAppMs: median(repeat.map((r) => toMs(r.app)))
		}
	};
}

async function main() {
	const results = {};
	for (const route of ROUTES) {
		results[route.id] = await measureRoute(route);
		fs.writeFileSync(
			OUT,
			JSON.stringify({ results, updatedAt: new Date().toISOString() }, null, 2)
		);
	}
	console.log("\n=== SUMMARY ===");
	const summary = Object.fromEntries(
		Object.entries(results).map(([k, v]) => [k, v.medians])
	);
	console.log(JSON.stringify(summary, null, 2));
	fs.writeFileSync(
		OUT,
		JSON.stringify({ results, summary, updatedAt: new Date().toISOString() }, null, 2)
	);
	console.log(`wrote ${OUT}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
