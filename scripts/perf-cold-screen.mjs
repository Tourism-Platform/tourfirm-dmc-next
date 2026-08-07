/**
 * Cold screening / focused cold×N for named routes.
 * Usage:
 *   node scripts/perf-cold-screen.mjs --routes catalog,preview --times 1 --out .perf-exp-a-screen.json
 *   node scripts/perf-cold-screen.mjs --routes catalog --times 3 --out .perf-exp-a-cold3.json
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

const ALL = {
	home: {
		id: "home",
		path: "/en",
		matchFn: (l) => /GET \/en 200/.test(l) && !/GET \/en\//.test(l)
	},
	catalog: {
		id: "catalog",
		path: "/en/tours",
		matchFn: (l) => /GET \/en\/catalog 200/.test(l)
	},
	preview: {
		id: "preview",
		path: `/en/tours/${TOUR}`,
		matchFn: (l) =>
			l.includes(`GET /en/tours/${TOUR} 200`) && !l.includes("/booking")
	},
	booking: {
		id: "booking",
		path: `/en/tours/${TOUR}/booking`,
		matchFn: (l) => l.includes(`GET /en/tours/${TOUR}/booking 200`)
	}
};

function arg(name, fallback) {
	const i = process.argv.indexOf(name);
	return i >= 0 ? process.argv[i + 1] : fallback;
}

const routeIds = String(arg("--routes", "catalog"))
	.split(",")
	.map((s) => s.trim())
	.filter(Boolean);
const times = Number(arg("--times", "1"));
const out = path.join(ROOT, arg("--out", ".perf-cold-screen.json"));
const label = arg("--label", "");

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
						l.includes(" 200 ") &&
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

async function main() {
	const results = { label, times, routes: {} };
	for (const id of routeIds) {
		const route = ALL[id];
		if (!route) throw new Error(`unknown route ${id}`);
		const cold = [];
		for (let i = 1; i <= times; i++) {
			console.log(`\n=== COLD ${route.id} #${i}/${times} ${label} ===`);
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
		results.routes[id] = {
			cold,
			medians: {
				coldTotalMs: median(cold.map((r) => toMs(r.total))),
				coldNextMs: median(cold.map((r) => toMs(r.next))),
				coldAppMs: median(cold.map((r) => toMs(r.app)))
			}
		};
		fs.writeFileSync(
			out,
			JSON.stringify(
				{ ...results, updatedAt: new Date().toISOString() },
				null,
				2
			)
		);
	}
	console.log("\n=== SCREEN SUMMARY ===");
	console.log(JSON.stringify(results, null, 2));
	fs.writeFileSync(
		out,
		JSON.stringify(
			{ ...results, updatedAt: new Date().toISOString() },
			null,
			2
		)
	);
	console.log(`wrote ${out}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
