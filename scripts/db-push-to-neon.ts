import { spawn } from "node:child_process";

import fsSync from "node:fs";

import fs from "node:fs/promises";

import path from "node:path";

import { fileURLToPath } from "node:url";

import pg from "pg";

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



type TSchemaObjectCounts = {

	tables: number;

	indexes: number;

	foreignKeys: number;

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
			continue;
		}

		if (!arg.startsWith("-") && arg.toLowerCase().endsWith(".dump")) {
			options.restoreFile = path.resolve(arg);
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



	if (!directUri) {

		throw new Error(

			"DATABASE_URI_DIRECT is required (direct Neon endpoint, without -pooler)"

		);

	}



	if (!isNeonDatabase(directUri)) {

		throw new Error("DATABASE_URI_DIRECT must point to a Neon database (*.neon.tech)");

	}



	if (directUri.includes("-pooler.")) {

		throw new Error("DATABASE_URI_DIRECT must not use the pooler endpoint");

	}



	return directUri;

}



function withRestoreConnectionParams(uri: string): string {

	const url = new URL(uri);



	if (!url.searchParams.has("connect_timeout")) {

		url.searchParams.set("connect_timeout", "60");

	}



	return url.toString();

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



function runCommandWithLog(

	command: string,

	args: string[],

	label: string,

	logPath: string

): Promise<void> {

	return new Promise((resolve, reject) => {

		const redactedArgs = args.map((arg) =>

			arg.startsWith("postgresql://") ? maskConnectionUri(arg) : arg

		);



		console.log(`\n> ${label}`);

		console.log(`  ${command} ${redactedArgs.join(" ")}`);

		console.log(`  Log file: ${logPath}`);



		const logStream = fsSync.createWriteStream(logPath, { flags: "w" });

		const writeLog = (chunk: Buffer | string): void => {

			const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");

			logStream.write(text);

			process.stdout.write(text);

		};



		const child = spawn(command, args, {

			shell: false,

			windowsHide: true,

			stdio: ["ignore", "pipe", "pipe"],

			env: process.env

		});



		child.stdout?.on("data", writeLog);

		child.stderr?.on("data", writeLog);



		child.on("error", (error) => {

			logStream.end();

			reject(error);

		});



		child.on("close", (code) => {

			logStream.end();



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



async function createRestoreLogPath(): Promise<string> {

	await fs.mkdir(DUMPS_DIR, { recursive: true });



	const stamp = new Date().toISOString().replace(/[:.]/g, "-");

	return path.join(DUMPS_DIR, `push-neon-${stamp}.log`);

}



async function wipeNeonSchema(neonUri: string): Promise<void> {

	const connectionString = withRestoreConnectionParams(neonUri);



	console.log("\n> Wiping Neon public schema (replace mode)");

	console.log(`  target: ${maskConnectionUri(connectionString)}`);



	const client = new pg.Client({ connectionString });



	try {

		await client.connect();

		await client.query("DROP SCHEMA IF EXISTS public CASCADE");

		await client.query("CREATE SCHEMA public");

		await client.query("GRANT ALL ON SCHEMA public TO public");



		const verify = await client.query<{ count: string }>(

			"SELECT count(*)::text AS count FROM pg_tables WHERE schemaname = 'public'"

		);

		const tableCount = Number(verify.rows[0]?.count ?? 0);



		if (tableCount !== 0) {

			throw new Error(

				`Neon schema wipe incomplete: public still has ${tableCount} tables`

			);

		}



		console.log("  Neon public schema wiped (0 tables remaining)");

	} finally {

		await client.end();

	}

}



async function querySchemaObjectCounts(

	connectionString: string

): Promise<TSchemaObjectCounts> {

	const client = new pg.Client({ connectionString });



	try {

		await client.connect();



		const [tables, indexes, foreignKeys] = await Promise.all([

			client.query<{ count: string }>(

				"SELECT count(*)::text AS count FROM pg_tables WHERE schemaname = 'public'"

			),

			client.query<{ count: string }>(

				"SELECT count(*)::text AS count FROM pg_indexes WHERE schemaname = 'public'"

			),

			client.query<{ count: string }>(

				"SELECT count(*)::text AS count FROM pg_constraint WHERE contype = 'f'"

			)

		]);



		return {

			tables: Number(tables.rows[0]?.count ?? 0),

			indexes: Number(indexes.rows[0]?.count ?? 0),

			foreignKeys: Number(foreignKeys.rows[0]?.count ?? 0)

		};

	} finally {

		await client.end();

	}

}



function formatCountsRow(label: string, counts: TSchemaObjectCounts): string {

	return `  ${label.padEnd(8)} tables=${counts.tables}  indexes=${counts.indexes}  foreign_keys=${counts.foreignKeys}`;

}



async function verifyRestoreAgainstLocal(

	neonUri: string,

	localUri: string

): Promise<void> {

	console.log("\n> Verifying restored schema against local database");



	const [localCounts, neonCounts] = await Promise.all([

		querySchemaObjectCounts(localUri),

		querySchemaObjectCounts(withRestoreConnectionParams(neonUri))

	]);



	console.log(formatCountsRow("local:", localCounts));

	console.log(formatCountsRow("neon:", neonCounts));



	const mismatches: string[] = [];



	if (neonCounts.tables !== localCounts.tables) {

		mismatches.push(

			`tables: neon=${neonCounts.tables}, local=${localCounts.tables}`

		);

	}



	if (neonCounts.indexes !== localCounts.indexes) {

		mismatches.push(

			`indexes: neon=${neonCounts.indexes}, local=${localCounts.indexes}`

		);

	}



	if (neonCounts.foreignKeys !== localCounts.foreignKeys) {

		mismatches.push(

			`foreign_keys: neon=${neonCounts.foreignKeys}, local=${localCounts.foreignKeys}`

		);

	}



	if (mismatches.length > 0) {

		throw new Error(

			`Restore verification failed — count mismatch:\n  ${mismatches.join("\n  ")}`

		);

	}



	console.log("  Verification passed: Neon counts match local database");

}



function isSslEofError(logContent: string): boolean {

	const normalized = logContent.toLowerCase();



	return (

		normalized.includes("ssl syscall") &&

		(normalized.includes("eof") || normalized.includes("конец файла"))

	);

}



function reportRestoreFailure(logPath: string): void {

	let logContent = "";



	try {

		logContent = fsSync.readFileSync(logPath, "utf8");

	} catch {

		console.error(`\nRestore log not readable: ${logPath}`);

		return;

	}



	if (!isSslEofError(logContent)) {

		return;

	}



	const lines = logContent.split(/\r?\n/);

	const eofLineIndex = lines.findIndex((line) => {

		const lower = line.toLowerCase();

		return (
			lower.includes("ssl syscall") &&
			(lower.includes("eof") || lower.includes("конец файла"))
		);

	});



	console.error("\n--- SSL SYSCALL EOF diagnostics ---");

	console.error(`Full log saved: ${logPath}`);



	if (eofLineIndex >= 0) {

		const contextStart = Math.max(0, eofLineIndex - 15);

		const contextEnd = Math.min(lines.length, eofLineIndex + 10);



		console.error("\nContext around first SSL EOF (±15 lines):");

		for (let index = contextStart; index < contextEnd; index += 1) {

			const marker = index === eofLineIndex ? ">>>" : "   ";

			console.error(`${marker} ${lines[index]}`);

		}



		const lastSuccessIndex = lines

			.slice(0, eofLineIndex)

			.findLastIndex((line) => {

				if (line.includes("при обработке оглавления")) {

					return false;

				}

				return (

					line.includes("создаётся INDEX") ||

					line.includes("creating INDEX") ||

					line.includes("processing data for table") ||

					line.includes("обрабатываются данные таблицы")

				);

			});



		if (lastSuccessIndex >= 0) {

			console.error(

				`\nLast successful operation before EOF (line ${lastSuccessIndex + 1}):`

			);

			console.error(`  ${lines[lastSuccessIndex]}`);

		}

	}



	console.error("\nNext experiment (change ONE variable only):");

	console.error(

		"  1. Neon Console → increase min Compute Unit to 2 (8 GB RAM), then re-run the same restore-only command"

	);

	console.error(

		"  2. Check Neon Console → Monitoring (RAM/CPU) and Postgres logs for the restore time window"

	);

	console.error("  3. Check https://status.neon.tech for platform incidents");

	console.error(

		"  Do NOT change --single-transaction, keepalive, or timeouts until experiment 1 result is known."

	);

	console.error("--- end diagnostics ---\n");

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

	append: boolean,

	logPath: string

): Promise<void> {

	const pgRestore = await resolvePgTool("pg_restore");



	const args = [

		"--dbname",

		withRestoreConnectionParams(neonUri),

		"--no-owner",

		"--no-acl",

		"--exit-on-error",

		"--jobs=1",

		"--verbose",

		dumpPath

	];



	await runCommandWithLog(

		pgRestore,

		args,

		append

			? "Restoring dump to Neon (append)"

			: "Restoring dump to Neon (replace, schema pre-wiped)",

		logPath

	);

}



function logAppendWarnings(): void {

	console.warn(

		"  ! append mode: no schema wipe. Duplicate keys / already exists errors are likely if Neon already has data."

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



	const restoreLogPath = await createRestoreLogPath();



	try {

		if (!options.append) {

			await wipeNeonSchema(neonUri);

		}



		await restoreToNeon(neonUri, dumpPath, options.append, restoreLogPath);



		if (!options.append) {

			const baselineUri = localUri ?? resolveLocalDatabaseUri();

			await verifyRestoreAgainstLocal(neonUri, baselineUri);

		}

	} catch (error) {

		reportRestoreFailure(restoreLogPath);

		throw error;

	}



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


