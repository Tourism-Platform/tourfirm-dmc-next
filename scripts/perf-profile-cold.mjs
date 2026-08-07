/**
 * Cold booking+catalog with Turbopack tracing + CPU prof.
 * Usage: node scripts/perf-profile-cold.mjs
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
const LOG = path.join(ROOT, ".perf-profile-server.log");
const OUT = path.join(ROOT, ".perf-profile-results.json");

const ROUTES = [
	{
		id: "booking",
		path: `/en/tours/${TOUR}/booking`,
		matchFn: (l) =>
			l.includes(`GET /en/tours/${TOUR}/booking 200`) &&
			l.includes("application-code")
	},
	{
		id: "catalog",
		path: "/en/tours",
		matchFn: (l) =>
			/GET \/en\/catalog 200/.test(l) && l.includes("application-code")
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

function listArtifacts() {
	const hits = [];
	const candidates = [
		".next/trace-turbopack",
		".next-profiles",
		".next/cpu-profiles",
		".next/dev/trace",
		".next/dev/logs"
	];
	for (const rel of candidates) {
		const abs = path.join(ROOT, rel);
		if (!fs.existsSync(abs)) continue;
		const st = fs.statSync(abs);
		if (st.isFile()) {
			hits.push({ path: rel, bytes: st.size });
		} else {
			const files = [];
			const walk = (dir, prefix) => {
				for (const name of fs.readdirSync(dir)) {
					const p = path.join(dir, name);
					const s = fs.statSync(p);
					const r = path.join(prefix, name).replace(/\\/g, "/");
					if (s.isDirectory()) walk(p, r);
					else files.push({ path: r, bytes: s.size });
				}
			};
			walk(abs, rel.replace(/\\/g, "/"));
			hits.push(...files.slice(0, 50));
		}
	}
	return hits;
}

async function startServer(routeId) {
	if (fs.existsSync(LOG)) fs.unlinkSync(LOG);
	const logFd = fs.openSync(LOG, "a");
	const child = spawn(
		"npx",
		[
			"next",
			"dev",
			"-H",
			HOST,
			"-p",
			String(PORT),
			"--experimental-cpu-prof"
		],
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
		if (text.includes("Ready in")) {
			return { child, readyMs: Date.now() - t0, routeId };
		}
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
				.find((l) => l.includes("GET ") && matchFn(l));
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

async function main() {
	const results = { routes: {}, artifacts: [], notes: [] };
	for (const route of ROUTES) {
		console.log(`\n=== PROFILE COLD ${route.id} ===`);
		rmDev();
		const { child, readyMs } = await startServer(route.id);
		try {
			const timing = await fireAndWait(route.path, route.matchFn);
			console.log(JSON.stringify({ readyMs, timing }));
			await sleep(2000);
			const arts = listArtifacts();
			results.routes[route.id] = { readyMs, timing, artifacts: arts };
			console.log("artifacts", JSON.stringify(arts, null, 2));
		} finally {
			killTree(child);
			await sleep(4000);
			const after = listArtifacts();
			results.routes[route.id].artifactsAfterExit = after;
		}
	}
	results.notes.push(
		"NEXT_TURBOPACK_TRACING=1 + --experimental-cpu-prof on Next 16.2.7"
	);
	results.notes.push(
		"Published Next only includes overview/info-level Turbopack tracing"
	);
	fs.writeFileSync(
		OUT,
		JSON.stringify(
			{ ...results, updatedAt: new Date().toISOString() },
			null,
			2
		)
	);
	console.log(`wrote ${OUT}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
