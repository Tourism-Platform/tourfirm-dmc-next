import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOCALES_DIR = path.join(
	ROOT,
	"src/entities/tour/catalog/mock/generated/locales"
);
const LEGACY_LOCALE_COMMIT = "50bb339";
const LOCALES = ["en", "ru", "uz"];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const EXCLUDED_IMAGE_PATHS = new Set([
	"/assets/images/destinations/route-map-overlay.png"
]);
const COVER_POOL_DIRS = [
	"images/city",
	"images/destinations",
	"images/service-areas",
	"images/tours"
].map((segment) => path.join(ROOT, "public/assets", segment));

const MOCK_FILE_CONFIG = [
	{
		fileName: "tour-packages.generated.ts",
		exportName: "TOUR_PACKAGE_MOCKS",
		legacyKey: "TOUR_PACKAGE_MOCKS",
		legacyByLocaleKey: "TOUR_PACKAGE_MOCKS_BY_LOCALE",
		typeImport:
			'import type { ITourPackageMockBundle } from "../../tour-packages.types";',
		typeAnnotation: "Record<string, ITourPackageMockBundle>"
	},
	{
		fileName: "catalog-tours.generated.ts",
		exportName: "CATALOG_TOURS_MOCK",
		legacyKey: "CATALOG_TOURS_MOCK",
		legacyByLocaleKey: "CATALOG_TOURS_MOCK_BY_LOCALE",
		typeImport: 'import type { ICatalogTourBackend } from "../../../../types";',
		typeAnnotation: "ICatalogTourBackend[]"
	},
	{
		fileName: "popular-tours.generated.ts",
		exportName: "POPULAR_TOURS_MOCK",
		legacyKey: "POPULAR_TOURS_MOCK",
		legacyByLocaleKey: "POPULAR_TOURS_MOCK_BY_LOCALE",
		typeImport: 'import type { ICatalogTourBackend } from "../../../../types";',
		typeAnnotation: "ICatalogTourBackend[]"
	},
	{
		fileName: "special-offers.generated.ts",
		exportName: "SPECIAL_OFFERS_MOCK",
		legacyKey: "SPECIAL_OFFERS_MOCK",
		legacyByLocaleKey: "SPECIAL_OFFERS_MOCK_BY_LOCALE",
		typeImport: 'import type { ICatalogTourBackend } from "../../../../types";',
		typeAnnotation: "ICatalogTourBackend[]"
	},
	{
		fileName: "catalog-regions.generated.ts",
		exportName: "CATALOG_REGIONS_MOCK",
		legacyKey: "CATALOG_REGIONS_MOCK",
		legacyByLocaleKey: "CATALOG_REGIONS_MOCK_BY_LOCALE",
		typeImport: null,
		typeAnnotation: null
	},
	{
		fileName: "price-histogram.generated.ts",
		exportName: "PRICE_HISTOGRAM_MOCK",
		legacyKey: "PRICE_HISTOGRAM_MOCK",
		legacyByLocaleKey: "PRICE_HISTOGRAM_MOCK_BY_LOCALE",
		typeImport: null,
		typeAnnotation: null
	}
];

function collectAssetImages(dir, base) {
	const entries = readdirSync(dir, { withFileTypes: true });
	const images = [];

	for (const entry of entries) {
		if (!entry.isFile()) continue;

		const urlPath = `${base}/${entry.name}`;
		const ext = path.extname(entry.name).toLowerCase();

		if (IMAGE_EXTENSIONS.has(ext) && !EXCLUDED_IMAGE_PATHS.has(urlPath)) {
			images.push(urlPath);
		}
	}

	return images;
}

const COVER_POOL = COVER_POOL_DIRS.flatMap((dir) => {
	const base = `/assets/${path.relative(path.join(ROOT, "public/assets"), dir).replace(/\\/g, "/")}`;
	return collectAssetImages(dir, base);
}).sort();

function hashTourId(id) {
	return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickImage(tourId, offset = 0) {
	return COVER_POOL[(hashTourId(tourId) + offset) % COVER_POOL.length];
}

function applyBundleImages(tourId, bundle) {
	const cover = pickImage(tourId, 0);

	bundle.catalog.image_url = cover;
	bundle.general.cover_image_path = cover;

	if (Array.isArray(bundle.landing.images) && bundle.landing.images.length > 0) {
		bundle.landing.images = bundle.landing.images.map((image, index) => ({
			...image,
			image_url: pickImage(tourId, index + 1),
			is_primary: index === 0
		}));
	}

	return bundle;
}

function applyListImages(tours) {
	return tours.map((tour) => ({
		...tour,
		image_url: pickImage(tour.id, 0)
	}));
}

function stripTourPackageBundle(bundle) {
	const { catalog, general, landing, operator } = bundle;
	return { catalog, general, landing, operator };
}

function serializeValue(value, depth = 1) {
	const indent = "\t".repeat(depth);

	if (value === null) {
		return "null";
	}

	if (typeof value === "string") {
		return JSON.stringify(value);
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return "[]";
		}

		return `[\n${value
			.map((item) => `${indent}\t${serializeValue(item, depth + 1)}`)
			.join(",\n")}\n${indent}]`;
	}

	if (typeof value === "object") {
		const entries = Object.entries(value);

		return `{\n${entries
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

async function loadModuleFromSource(source, label) {
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020
		}
	}).outputText;

	const tempDir = await mkdtemp(path.join(tmpdir(), `tour-mock-${label}-`));
	const tempFile = path.join(tempDir, "module.cjs");
	await writeFile(tempFile, transpiled, "utf8");

	const require = createRequire(import.meta.url);
	return require(tempFile);
}

async function loadModuleFromPath(filePath, label) {
	const source = readFileSync(filePath, "utf8");
	return loadModuleFromSource(source, label);
}

function readLegacyByLocaleSource() {
	return execSync(
		`git show ${LEGACY_LOCALE_COMMIT}:src/entities/tour/catalog/mock/generated/tour-packages.generated.ts`,
		{ cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
	);
}

async function loadLocaleModules() {
	let legacyByLocaleModule = null;

	try {
		const legacySource = readLegacyByLocaleSource();
		legacyByLocaleModule = await loadModuleFromSource(legacySource, "legacy");
	} catch {
		legacyByLocaleModule = null;
	}

	const localeModules = {};

	for (const locale of LOCALES) {
		const localeDir = path.join(LOCALES_DIR, locale);
		const hasLocaleFiles =
			existsSync(localeDir) &&
			MOCK_FILE_CONFIG.every((config) =>
				existsSync(path.join(localeDir, config.fileName))
			);

		if (hasLocaleFiles) {
			const merged = {};

			for (const config of MOCK_FILE_CONFIG) {
				const filePath = path.join(localeDir, config.fileName);
				const fileModule = await loadModuleFromPath(
					filePath,
					`${locale}-${config.exportName}`
				);
				merged[config.exportName] = fileModule[config.exportName];
			}

			localeModules[locale] = merged;
			continue;
		}

		if (!legacyByLocaleModule) {
			throw new Error(`Missing locale source for "${locale}"`);
		}

		const merged = {};

		for (const config of MOCK_FILE_CONFIG) {
			merged[config.exportName] =
				legacyByLocaleModule[config.legacyByLocaleKey][locale];
		}

		localeModules[locale] = merged;
	}

	return localeModules;
}

function processLocaleData(rawData) {
	const tourPackageMocks = Object.fromEntries(
		Object.entries(rawData.TOUR_PACKAGE_MOCKS).map(([tourId, bundle]) => [
			tourId,
			applyBundleImages(tourId, stripTourPackageBundle(structuredClone(bundle)))
		])
	);

	return {
		TOUR_PACKAGE_MOCKS: tourPackageMocks,
		CATALOG_TOURS_MOCK: applyListImages(
			structuredClone(rawData.CATALOG_TOURS_MOCK)
		),
		POPULAR_TOURS_MOCK: applyListImages(
			structuredClone(rawData.POPULAR_TOURS_MOCK)
		),
		SPECIAL_OFFERS_MOCK: applyListImages(
			structuredClone(rawData.SPECIAL_OFFERS_MOCK)
		),
		CATALOG_REGIONS_MOCK: structuredClone(rawData.CATALOG_REGIONS_MOCK),
		PRICE_HISTOGRAM_MOCK: structuredClone(rawData.PRICE_HISTOGRAM_MOCK)
	};
}

function buildLocaleFileContent(config, value) {
	const typeLine = config.typeImport ? `${config.typeImport}\n\n` : "";
	const annotation = config.typeAnnotation
		? `: ${config.typeAnnotation}`
		: "";

	return `/* eslint-disable */
// generated by scripts/build-tour-packages-mock.mjs — do not edit manually
${typeLine}export const ${config.exportName}${annotation} = ${serializeValue(value, 0)};
`;
}

async function writeLocaleFiles(locale, data) {
	const localeDir = path.join(LOCALES_DIR, locale);
	await mkdir(localeDir, { recursive: true });

	for (const config of MOCK_FILE_CONFIG) {
		const output = buildLocaleFileContent(config, data[config.exportName]);
		writeFileSync(path.join(localeDir, config.fileName), output, "utf8");
	}
}

async function main() {
	const localeModules = await loadLocaleModules();
	const tourCounts = [];

	for (const locale of LOCALES) {
		const processed = processLocaleData(localeModules[locale]);
		await writeLocaleFiles(locale, processed);
		tourCounts.push(
			`${locale}: ${Object.keys(processed.TOUR_PACKAGE_MOCKS).length} tours`
		);
	}

	console.log(`Done. ${COVER_POOL.length} cover images.`);
	console.log(tourCounts.join(", "));
	console.log(`Written to ${LOCALES_DIR}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
