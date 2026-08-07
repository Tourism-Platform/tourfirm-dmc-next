/**
 * Profile one cold route; preserve .next/dev/trace (+ turbopack) under .perf-traces-<id>/
 * Usage: node scripts/perf-profile-one.mjs booking|catalog
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
const LOG = path.join(ROOT, ".perf-profile-one.log");
const id = process.argv[2] || "booking";

const ROUTES = {
	booking: {
		path: `/en/tours/${TOUR}/booking`,
		match: (l) =>
			l.includes(`GET /en/tours/${TOUR}/booking 200`) &&
			l.includes("application-code")
	},
	catalog: {
		path: "/en/tours",
		match: (l) =>
			/GET \/en\/catalog 200/.test(l) && l.includes("application-code")
	}
};

const route = ROUTES[id];
if (!route) throw new Error(`unknown ${id}`);

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function rmDev() {
	const p = path.join(ROOT, ".next", "dev");
	if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function killTree(child) {
	if (!child?.pid) return;
	if (process.platform === "win32") {
		spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
			stdio: "ignore"
		});
	} else child.kill("SIGKILL");
}

async function startServer() {
	if (fs.existsSync(LOG)) fs.unlinkSync(LOG);
	const logFd = fs.openSync(LOG, "a");
	const child = spawn(
		"npx",
		["next", "dev", "-H", HOST, "-p", String(PORT), "--experimental-cpu-prof"],
		{
			cwd: ROOT,
			env: {
				...process.env,
				NEXT_TELEMETRY_DISABLED: "1",
				NEXT_TURBOPACK_TRACING: "1"
			},
			stdio: ["ignore", logFd, logFd],
			shell: true
		}
	);
	const t0 = Date.now();
	while (Date.now() - t0 < 180000) {
		const text = fs.existsSync(LOG) ? fs.readFileSync(LOG, "utf8") : "";
		if (text.includes("Ready in")) return child;
		if (child.exitCode != null) throw new Error("server exited early");
		await sleep(500);
	}
	killTree(child);
	throw new Error("ready timeout");
}

function fireAndWait(maxMs = 900000) {
	const startSize = fs.existsSync(LOG)
		? fs.readFileSync(LOG, "utf8").length
		: 0;
	http
		.get(`http://${HOST}:${PORT}${route.path}`, { timeout: maxMs }, (res) =>
			res.resume()
		)
		.on("error", () => {});
	const t0 = Date.now();
	return new Promise((resolve, reject) => {
		const timer = setInterval(() => {
			const text = fs.readFileSync(LOG, "utf8").slice(startSize);
			const line = text
				.split(/\r?\n/)
				.find((l) => l.includes("GET ") && route.match(l));
			if (line) {
				clearInterval(timer);
				resolve({ line: line.trim(), elapsedMs: Date.now() - t0 });
			} else if (Date.now() - t0 > maxMs) {
				clearInterval(timer);
				reject(new Error("timeout"));
			}
		}, 1000);
	});
}

function summarizeTrace(tracePath) {
	const text = fs.readFileSync(tracePath, "utf8");
	const events = [];
	for (const line of text.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const parsed = JSON.parse(line);
			const arr = Array.isArray(parsed) ? parsed : [parsed];
			events.push(...arr);
		} catch {
			/* ignore */
		}
	}
	const byName = {};
	for (const e of events) {
		const name = e.name || "unknown";
		const durMs = (e.duration || 0) / 1000;
		if (!byName[name]) byName[name] = { count: 0, totalMs: 0, maxMs: 0, samples: [] };
		byName[name].count += 1;
		byName[name].totalMs += durMs;
		byName[name].maxMs = Math.max(byName[name].maxMs, durMs);
		if (name === "compile-path" || name === "ensure-page" || name === "handle-request") {
			byName[name].samples.push({
				ms: Math.round(durMs),
				trigger: e.tags?.trigger,
				inputPage: e.tags?.inputPage,
				url: e.tags?.url
			});
		}
	}
	const ranked = Object.entries(byName)
		.map(([name, v]) => ({
			name,
			count: v.count,
			totalMs: Math.round(v.totalMs),
			maxMs: Math.round(v.maxMs),
			samples: v.samples?.slice(0, 10)
		}))
		.sort((a, b) => b.totalMs - a.totalMs);
	return { eventCount: events.length, ranked };
}

async function main() {
	rmDev();
	const child = await startServer();
	let timing;
	try {
		timing = await fireAndWait();
		console.log(timing.line);
		await sleep(3000);
	} finally {
		killTree(child);
		await sleep(3000);
	}

	const outDir = path.join(ROOT, `.perf-traces-${id}`);
	fs.rmSync(outDir, { recursive: true, force: true });
	fs.mkdirSync(outDir, { recursive: true });
	for (const rel of ["trace", "trace-turbopack"]) {
		const src = path.join(ROOT, ".next", "dev", rel);
		if (fs.existsSync(src)) {
			fs.copyFileSync(src, path.join(outDir, rel));
		}
	}
	const summary = summarizeTrace(path.join(outDir, "trace"));
	const result = {
		id,
		timing,
		traceSummary: summary,
		copied: fs.readdirSync(outDir),
		updatedAt: new Date().toISOString()
	};
	fs.writeFileSync(
		path.join(outDir, "summary.json"),
		JSON.stringify(result, null, 2)
	);
	console.log(JSON.stringify(summary.ranked.slice(0, 15), null, 2));
	console.log(`wrote ${outDir}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
