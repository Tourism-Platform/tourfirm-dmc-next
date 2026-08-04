/**
 * Re-seed all geo collections after FAQ patch (local).
 * countries → regions → cities → attractions
 */
import { spawn } from "node:child_process";

const scripts = [
	"scripts/seed-countries-only.ts",
	"scripts/seed-regions-only.ts",
	"scripts/seed-cities-only.ts",
	"scripts/seed-attractions-only.ts"
];

function run(script: string): Promise<void> {
	return new Promise((resolve, reject) => {
		console.log(`\n=== Running ${script} ===\n`);
		const child = spawn(
			"npx",
			["cross-env", "NODE_OPTIONS=--no-deprecation", "tsx", script],
			{ stdio: "inherit", shell: true }
		);
		child.on("exit", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${script} exited with ${code}`));
		});
	});
}

async function main(): Promise<void> {
	for (const script of scripts) {
		await run(script);
	}
	console.log("\nAll geo FAQ reseeds complete");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
