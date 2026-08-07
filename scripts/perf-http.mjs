import http from "node:http";

const url = process.argv[2] || "http://127.0.0.1:3030/en";
const maxMs = Number(process.argv[3] || 600000);
const t0 = Date.now();

const req = http.get(url, { timeout: maxMs }, (res) => {
	let bytes = 0;
	console.log(
		`HEADERS status=${res.statusCode} t=${Date.now() - t0}ms`
	);
	res.on("data", (chunk) => {
		bytes += chunk.length;
	});
	res.on("end", () => {
		console.log(`END bytes=${bytes} t=${Date.now() - t0}ms`);
		process.exit(0);
	});
});

req.on("timeout", () => {
	console.log(`TIMEOUT t=${Date.now() - t0}ms`);
	req.destroy();
	process.exit(2);
});
req.on("error", (err) => {
	console.log(`ERROR ${err.message} t=${Date.now() - t0}ms`);
	process.exit(1);
});
