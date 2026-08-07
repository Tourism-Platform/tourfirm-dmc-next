/**
 * Fire one HTTP GET and wait until the Next server log shows a matching
 * GET line with application-code timing (source of truth).
 */
import fs from "node:fs";
import http from "node:http";

const url = process.argv[2];
const logPath = process.argv[3];
const matchSubstr = process.argv[4] || new URL(url).pathname;
const maxMs = Number(process.argv[5] || 900000);

if (!url || !logPath) {
	console.error(
		"usage: perf-wait-log.mjs <url> <server-log-path> [match] [maxMs]"
	);
	process.exit(1);
}

const startSize = fs.existsSync(logPath)
	? fs.readFileSync(logPath, "utf8").length
	: 0;
const t0 = Date.now();

const req = http.get(url, { timeout: maxMs }, (res) => {
	res.resume();
	res.on("end", () => {
		console.log(
			`CLIENT_END status=${res.statusCode} t=${Date.now() - t0}ms`
		);
	});
});
req.on("timeout", () => {
	console.log(`CLIENT_TIMEOUT t=${Date.now() - t0}ms (continuing log wait)`);
	req.destroy();
});
req.on("error", (err) => {
	console.log(`CLIENT_ERROR ${err.message} t=${Date.now() - t0}ms`);
});

const timer = setInterval(() => {
	if (!fs.existsSync(logPath)) return;
	const text = fs.readFileSync(logPath, "utf8").slice(startSize);
	const lines = text.split(/\r?\n/);
	const hit = lines.find(
		(l) =>
			l.includes("GET ") &&
			l.includes(matchSubstr) &&
			l.includes("application-code")
	);
	if (hit) {
		console.log(`SERVER_LOG ${hit.trim()}`);
		console.log(`ELAPSED_MS ${Date.now() - t0}`);
		clearInterval(timer);
		process.exit(0);
	}
	if (Date.now() - t0 > maxMs) {
		console.log(`WAIT_TIMEOUT t=${Date.now() - t0}ms`);
		clearInterval(timer);
		process.exit(2);
	}
}, 1000);
