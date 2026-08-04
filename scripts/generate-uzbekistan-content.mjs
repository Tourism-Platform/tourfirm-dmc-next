/** @deprecated Use generate-destination-content.mjs --country=uzbekistan */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const args = ["--country=uzbekistan", ...process.argv.slice(2)];
const r = spawnSync(
	process.execPath,
	[join(root, "generate-destination-content.mjs"), ...args],
	{ stdio: "inherit" }
);
process.exit(r.status ?? 1);
