import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://tourlink-tourbuilder.vercel.app/api";
const OUTPUT_DIR = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"data",
	"tour-packages"
);
const DELAY_MS = 150;

const session = "eyJ2IjoxLCJpYXQiOjE3ODIwMzg2NDcsImV4cCI6MTc4MjA0MjI0N30.aKC8vZpG_Pl_MmGnE14RonO9a7tHDSQo06MpfJpIl7U";

if (!session) {
	console.error("TL_PIN_SESSION is required. Example:");
	console.error(
		'  TL_PIN_SESSION=eyJ2Ijox... npm run fetch:tours'
	);
	process.exit(1);
}

const headers = {
	Cookie: `__tl_pin_session=${session}; NEXT_LOCALE=en`,
	Referer: "https://tourlink-tourbuilder.vercel.app/en/tours",
	Pragma: "no-cache"
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
	const response = await fetch(url, { headers });

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`${response.status} ${response.statusText}: ${url}\n${body}`);
	}

	return response.json();
}

function extractTourIds(listPayload) {
	const items = Array.isArray(listPayload)
		? listPayload
		: listPayload?.packages ??
			listPayload?.data ??
			listPayload?.items ??
			listPayload?.tours ??
			[];

	if (!Array.isArray(items)) {
		throw new Error("Unexpected list response shape");
	}

	return items
		.map((item) => (typeof item === "string" ? item : item?.id))
		.filter(Boolean);
}

async function main() {
	await mkdir(OUTPUT_DIR, { recursive: true });

	console.log("Fetching tour list...");
	const listPayload = await fetchJson(`${BASE_URL}/tour-packages?status=active`);
	const tourIds = extractTourIds(listPayload);

	if (!tourIds.length) {
		throw new Error("No tour ids found in list response");
	}

	await writeFile(
		path.join(OUTPUT_DIR, "_index.json"),
		JSON.stringify(listPayload, null, 2),
		"utf8"
	);

	console.log(`Found ${tourIds.length} tours`);

	for (const [index, tourId] of tourIds.entries()) {
		console.log(`[${index + 1}/${tourIds.length}] ${tourId}`);
		const tourPayload = await fetchJson(`${BASE_URL}/tour-packages/${tourId}`);
		await writeFile(
			path.join(OUTPUT_DIR, `${tourId}.json`),
			JSON.stringify(tourPayload, null, 2),
			"utf8"
		);

		if (index < tourIds.length - 1) {
			await sleep(DELAY_MS);
		}
	}

	console.log(`Done. Saved to ${OUTPUT_DIR}`);
}

main().catch((error) => {
	console.error(error.message);
	process.exit(1);
});
