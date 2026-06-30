import { spawn } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./load-env.js";

import { maskConnectionUri } from "./seed-timing.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DUMPS_DIR = path.join(ROOT, ".dumps");

type TCliOptions = {
	yes: boolean;
	append: boolean;
	keepDump: boolean;
	dumpOnly: boolean;
	restoreFile?: string;
};

function parseArgs(argv: string[]): TCliOptions {
	const options: TCliOptions = {
		yes: argv.some((arg) => arg === "--yes" || arg === "-y"),
		append: argv.includes("--append"),
		keepDump: argv.includes("--keep-dump"),
		dumpOnly: argv.includes("--dump-only")
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === "--restore-only") {
			const next = argv[index + 1];

			if (!next || next.startsWith("-")) {
				throw new Error("--restore-only requires a dump file path");
			}

			options.restoreFile = path.resolve(next);
			index += 1;
		}
	}

	return options;
}

function getHostname(connectionString: string): string {
	return new URL(connectionString).hostname;
}

function isLocalDatabase(connectionString: string): boolean {
	const hostname = getHostname(connectionString);

	return hostname === "localhost" || hostname === "127.0.0.1";
}

function isNeonDatabase(connectionString: string): boolean {
	return getHostname(connectionString).includes(".neon.tech");
}

function resolveLocalDatabaseUri(): string {
	const localUri = process.env.DATABASE_URI_LOCAL?.trim();

	if (localUri) {
		return localUri;
	}

	throw new Error(
		"DATABASE_URI_LOCAL is not set. Example: postgresql://postgres:password@localhost:5432/tourfirm"
	);
}

function resolveNeonDatabaseUri(): string {
	const directUri = process.env.DATABASE_URI_DIRECT?.trim();
	const defaultUri = process.env.DATABASE_URI?.trim();

	const uri = directUri || defaultUri;

	if (!uri) {
		throw new Error("DATABASE_URI or DATABASE_URI_DIRECT is not set");
	}

	if (!isNeonDatabase(uri)) {
		throw new Error(
			"Target must be a Neon database (DATABASE_URI_DIRECT or DATABASE_URI with *.neon.tech)"
		);
	}

	if (uri.includes("-pooler.")) {
		console.warn(
			"  ! using pooler endpoint for restore; prefer DATABASE_URI_DIRECT for large restores"
		);
	}

	return uri;
}

async function commandExists(command: string): Promise<boolean> {
	return new Promise((resolve) => {
		const child = spawn(command, ["--version"], {
			shell: process.platform === "win32",
			stdio: "ignore"
		});

		child.on("error", () => resolve(false));
		child.on("close", (code) => resolve(code === 0));
	});
}

function fileExists(filePath: string): boolean {
	try {
		const mode =
			process.platform === "win32"
				? fsSync.constants.F_OK
				: fsSync.constants.X_OK | fsSync.constants.F_OK;
		fsSync.accessSync(filePath, mode);
		return true;
	} catch {
		return false;
	}
}

function discoverWindowsPgBinDir(): string | undefined {
	const programFiles = process.env["ProgramFiles"] ?? "C:\\Program Files";
	const programFilesX86 =
		process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)";
	const candidates = [
		process.env.PG_BIN_DIR?.trim(),
		path.join(programFiles, "PostgreSQL"),
		path.join(programFilesX86, "PostgreSQL"),
		process.env.LOCALAPPDATA
			? path.join(process.env.LOCALAPPDATA, "Programs", "PostgreSQL")
			: undefined,
		process.env.USERPROFILE
			? path.join(
					process.env.USERPROFILE,
					"scoop",
					"apps",
					"postgresql",
					"current",
					"bin"
				)
			: undefined
	].filter((entry): entry is string => Boolean(entry));

	for (const baseDir of candidates) {
		if (!fsSync.existsSync(baseDir)) {
			continue;
		}

		if (baseDir.toLowerCase().endsWith("\\bin")) {
			const toolPath = path.join(
				baseDir,
				process.platform === "win32" ? "pg_dump.exe" : "pg_dump"
			);

			if (fileExists(toolPath)) {
				return baseDir;
			}

			continue;
		}

		let versions: fsSync.Dirent[];

		try {
			versions = fsSync.readdirSync(baseDir, { withFileTypes: true });
		} catch {
			continue;
		}

		const sorted = versions
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

		for (const version of sorted) {
			const binDir = path.join(baseDir, version, "bin");
			const toolPath = path.join(binDir, "pg_dump.exe");

			if (fileExists(toolPath)) {
				return binDir;
			}
		}
	}

	return undefined;
}

async function resolvePgTool(tool: "pg_dump" | "pg_restore"): Promise<string> {
	const explicit =
		tool === "pg_dump"
			? process.env.PG_DUMP?.trim()
			: process.env.PG_RESTORE?.trim();

	if (explicit && fileExists(explicit)) {
		return explicit;
	}

	if (await commandExists(tool)) {
		return tool;
	}

	if (process.platform === "win32") {
		const binDir = discoverWindowsPgBinDir();

		if (binDir) {
			const toolPath = path.join(
				binDir,
				tool === "pg_dump" ? "pg_dump.exe" : "pg_restore.exe"
			);

			if (fileExists(toolPath)) {
				console.log(`  Using PostgreSQL tools from: ${binDir}`);
				return toolPath;
			}
		}
	}

	throw new Error(
		`${tool} not found. Install PostgreSQL client tools or set PG_BIN_DIR in .env (e.g. C:\\Program Files\\PostgreSQL\\17\\bin)`
	);
}
function runCommand(
	command: string,
	args: string[],
	label: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		const redactedArgs = args.map((arg) =>
			arg.startsWith("postgresql://") ? maskConnectionUri(arg) : arg
		);

		console.log(`\n> ${label}`);
		console.log(`  ${command} ${redactedArgs.join(" ")}`);

		const child = spawn(command, args, {
			shell: false,
			windowsHide: true,
			stdio: "inherit",
			env: process.env
		});

		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
		});
	});
}

async function createDumpPath(): Promise<string> {
	await fs.mkdir(DUMPS_DIR, { recursive: true });

	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	return path.join(DUMPS_DIR, `local-to-neon-${stamp}.dump`);
}

async function dumpLocalDatabase(
	localUri: string,
	dumpPath: string
): Promise<void> {
	const pgDump = await resolvePgTool("pg_dump");

	await runCommand(
		pgDump,
		[
			"--format=custom",
			"--no-owner",
			"--no-acl",
			"--file",
			dumpPath,
			localUri
		],
		"Dumping local database"
	);

	const stat = await fs.stat(dumpPath);
	console.log(`  Dump saved: ${dumpPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

async function restoreToNeon(
	neonUri: string,
	dumpPath: string,
	append: boolean
): Promise<void> {
	const pgRestore = await resolvePgTool("pg_restore");

	const args = [
		"--dbname",
		neonUri,
		"--no-owner",
		"--no-acl",
		"--verbose",
		dumpPath
	];

	if (!append) {
		args.splice(2, 0, "--clean", "--if-exists");
	}

	await runCommand(
		pgRestore,
		args,
		append
			? "Restoring dump to Neon (append, no clean)"
			: "Restoring dump to Neon (existing Neon data will be replaced)"
	);
}

function logAppendWarnings(): void {
	console.warn(
		"  ! append mode: no --clean. Duplicate keys / already exists errors are likely if Neon already has data."
	);
	console.warn(
		"  ! after interrupted full restore, use db:push-neon:yes (replace), not append."
	);
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2));
	const neonUri = resolveNeonDatabaseUri();

	let dumpPath = options.restoreFile;
	let localUri: string | undefined;

	if (!dumpPath) {
		localUri = resolveLocalDatabaseUri();

		if (!isLocalDatabase(localUri)) {
			throw new Error(
				"DATABASE_URI_LOCAL must point to localhost (safety guard against dumping remote DB)"
			);
		}

		console.log("DB push: local -> Neon");
		console.log(`  mode: ${options.append ? "append" : "replace"}`);
		console.log(`  source: ${maskConnectionUri(localUri)}`);
		console.log(`  target: ${maskConnectionUri(neonUri)}`);

		if (options.append) {
			logAppendWarnings();
		}

		if (!options.dumpOnly && !options.yes) {
			throw new Error(
				options.append
					? "Refusing to push without confirmation. Run: npm run db:push-neon:append:yes"
					: "Refusing to overwrite Neon without confirmation. Run: npm run db:push-neon:yes"
			);
		}

		dumpPath = await createDumpPath();
		await dumpLocalDatabase(localUri, dumpPath);

		if (options.dumpOnly) {
			console.log("\nDump-only complete.");
			return;
		}
	} else {
		await fs.access(dumpPath);

		console.log("DB restore: dump file -> Neon");
		console.log(`  mode: ${options.append ? "append" : "replace"}`);
		console.log(`  dump:   ${dumpPath}`);
		console.log(`  target: ${maskConnectionUri(neonUri)}`);

		if (options.append) {
			logAppendWarnings();
		}

		if (!options.yes) {
			throw new Error(
				options.append
					? "Refusing to restore without confirmation. Run: npm run db:push-neon:append:yes -- --restore-only <file>"
					: "Refusing to overwrite Neon without confirmation. Run: npm run db:push-neon:yes -- --restore-only <file>"
			);
		}
	}

	await restoreToNeon(neonUri, dumpPath, options.append);

	if (!options.keepDump && !options.restoreFile) {
		await fs.unlink(dumpPath).catch(() => undefined);
		console.log(`  Removed temporary dump: ${dumpPath}`);
	}

	console.log("\nDone. Media files are not included — sync public/media/uploads separately if needed.");
}

main().catch((error: unknown) => {
	console.error("db:push-neon failed:", error);
	process.exit(1);
});
