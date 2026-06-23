import { readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MONOLITH_PATH = path.join(
	ROOT,
	"src/entities/tour/catalog/mock/generated/tour-packages.generated.ts"
);
const TARGET_PATH = path.join(
	ROOT,
	"src/entities/tour/catalog/mock/catalog-preview-options-static.mock.ts"
);

function serializeValue(value, depth = 1) {
	const indent = "\t".repeat(depth);

	if (value === null) return "null";
	if (typeof value === "string") return JSON.stringify(value);
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	if (Array.isArray(value)) {
		if (value.length === 0) return "[]";
		return `[\n${value
			.map((item) => `${indent}\t${serializeValue(item, depth + 1)}`)
			.join(",\n")}\n${indent}]`;
	}
	if (typeof value === "object") {
		return `{\n${Object.entries(value)
			.map(([key, entryValue]) => {
				const serializedKey = /^[A-Za-z_$][\w$]*$/.test(key)
					? key
					: JSON.stringify(key);
				return `${indent}\t${serializedKey}: ${serializeValue(entryValue, depth + 1)}`;
			})
			.join(",\n")}\n${indent}}`;
	}
	throw new Error(`Unsupported value type: ${typeof value}`);
}

async function main() {
	const source = readFileSync(MONOLITH_PATH, "utf8");
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020
		}
	}).outputText;

	const tempDir = await mkdtemp(path.join(tmpdir(), "opt-extract-"));
	const tempFile = path.join(tempDir, "module.cjs");
	await writeFile(tempFile, transpiled, "utf8");

	const require = createRequire(import.meta.url);
	const module = require(tempFile);
	const bundle = module.TOUR_PACKAGE_MOCKS[module.DEFAULT_TOUR_PACKAGE_ID];

	const output = `/* eslint-disable */
// extracted from legacy tour-packages.generated.ts — do not edit manually
import type {
	ICatalogPreviewOptionDetailBackend,
	ICatalogPreviewOptionListItemBackend,
	TCatalogPreviewPubEvent
} from "../types/catalog-preview-backend.types";
import type { TPubEventMediaFields } from "../types/catalog-preview-option-media.types";

type ICatalogPreviewOptionDetailWithMedia = Omit<
	ICatalogPreviewOptionDetailBackend,
	"events"
> & {
	events: Array<TCatalogPreviewPubEvent & TPubEventMediaFields>;
};

export const CATALOG_PREVIEW_TOUR_OPTIONS_LIST_STATIC: ICatalogPreviewOptionListItemBackend[] = ${serializeValue(
		bundle.options,
		0
	)};

export const CATALOG_PREVIEW_OPTION_BACKEND_STATIC: ICatalogPreviewOptionDetailWithMedia = ${serializeValue(
		bundle.optionDetail,
		0
	)};
`;

	writeFileSync(TARGET_PATH, output, "utf8");
	console.log(`Written to ${TARGET_PATH}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
