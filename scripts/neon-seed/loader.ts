import fs from "node:fs/promises";
import path from "node:path";

import { CONTENT_DIR, readYamlFile } from "../seed.js";

export type TNeonSeedStage =
	| "badges"
	| "countries"
	| "regions"
	| "cities"
	| "themes"
	| "attractions"
	| "experiences"
	| "experiencePatches"
	| "routes"
	| "routePatches"
	| "mapPoints"
	| "routesHub"
	| "experiencesHub"
	| "tradeFairs"
	| "blog"
	| "news"
	| "tradeFairsHub"
	| "blogHub"
	| "newsHub"
	| "refreshRouteMapCountries"
	| "refreshRouteMapRegions"
	| "refreshRouteMapCities"
	| "refreshRouteMapAttractions";

export type TNeonSeedItem = {
	itemIndex: number;
	stage: TNeonSeedStage;
	slug: string;
	filePath: string;
	stageIndex: number;
	mapPoint?: Record<string, unknown>;
};

export type TDryRunReport = {
	stages: Record<TNeonSeedStage, number>;
	totalItems: number;
	mediaPaths: string[];
	items: TNeonSeedItem[];
};

const ALL_STAGES: TNeonSeedStage[] = [
	"badges",
	"countries",
	"regions",
	"cities",
	"themes",
	"attractions",
	"experiences",
	"experiencePatches",
	"routes",
	"routePatches",
	"mapPoints",
	"routesHub",
	"experiencesHub",
	"tradeFairs",
	"blog",
	"news",
	"tradeFairsHub",
	"blogHub",
	"newsHub",
	"refreshRouteMapCountries",
	"refreshRouteMapRegions",
	"refreshRouteMapCities",
	"refreshRouteMapAttractions"
];

function createEmptyStageCounts(): Record<TNeonSeedStage, number> {
	return Object.fromEntries(ALL_STAGES.map((stage) => [stage, 0])) as Record<
		TNeonSeedStage,
		number
	>;
}

function resolveSlugFromRaw(
	raw: Record<string, unknown>,
	fallback: string
): string {
	const slug = raw.slug;

	if (typeof slug === "string") {
		return slug;
	}

	if (slug && typeof slug === "object" && slug !== null && "en" in slug) {
		return String((slug as Record<string, unknown>).en);
	}

	return fallback;
}

async function listYamlFiles(dirName: string): Promise<string[]> {
	const dirPath = path.join(CONTENT_DIR, dirName);

	try {
		return (await fs.readdir(dirPath))
			.filter((file) => file.endsWith(".yml"))
			.sort()
			.map((file) => path.join(dirPath, file));
	} catch {
		return [];
	}
}

function collectMediaPathsFromValue(value: unknown, paths: Set<string>): void {
	if (typeof value === "string") {
		if (
			value.startsWith("assets/images/") ||
			value.startsWith("assets/")
		) {
			paths.add(value);
		}

		return;
	}

	if (Array.isArray(value)) {
		for (const entry of value) {
			collectMediaPathsFromValue(entry, paths);
		}

		return;
	}

	if (value && typeof value === "object") {
		for (const entry of Object.values(value as Record<string, unknown>)) {
			collectMediaPathsFromValue(entry, paths);
		}
	}
}

async function collectMediaPathsForFiles(filePaths: string[]): Promise<string[]> {
	const paths = new Set<string>();

	for (const filePath of filePaths) {
		const raw = await readYamlFile<unknown>(filePath);
		collectMediaPathsFromValue(raw, paths);
	}

	return [...paths].sort();
}

async function buildMilestone1Items(startIndex: number): Promise<{
	items: TNeonSeedItem[];
	nextIndex: number;
}> {
	const items: TNeonSeedItem[] = [];
	let itemIndex = startIndex;

	const badgesPath = path.join(CONTENT_DIR, "badges.yml");
	const badges = await readYamlFile<Record<string, unknown>[]>(badgesPath);

	for (const [stageIndex, badge] of badges.entries()) {
		if (typeof badge.slug !== "string") {
			throw new Error("Badge seed item must include a string slug");
		}

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "badges",
			slug: badge.slug,
			filePath: badgesPath,
			stageIndex
		});
	}

	for (const stage of ["countries", "regions", "cities"] as const) {
		const files = await listYamlFiles(stage);

		for (const [stageIndex, filePath] of files.entries()) {
			const raw = await readYamlFile<Record<string, unknown>>(filePath);
			const slug = resolveSlugFromRaw(
				raw,
				path.basename(filePath).replace(/\.yml$/, "")
			);

			itemIndex += 1;
			items.push({
				itemIndex,
				stage,
				slug,
				filePath,
				stageIndex
			});
		}
	}

	return { items, nextIndex: itemIndex };
}

async function loadMilestone2Items(startIndex: number): Promise<{
	items: TNeonSeedItem[];
	nextIndex: number;
}> {
	const items: TNeonSeedItem[] = [];
	let itemIndex = startIndex;

	const themesPath = path.join(CONTENT_DIR, "themes.yml");
	const themes = await readYamlFile<Record<string, unknown>[]>(themesPath);

	for (const [stageIndex, theme] of themes.entries()) {
		const slug = resolveSlugFromRaw(theme, `theme-${String(stageIndex)}`);

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "themes",
			slug,
			filePath: themesPath,
			stageIndex
		});
	}

	for (const stage of ["attractions"] as const) {
		const files = await listYamlFiles(stage);

		for (const [stageIndex, filePath] of files.entries()) {
			const raw = await readYamlFile<Record<string, unknown>>(filePath);
			const slug = resolveSlugFromRaw(
				raw,
				path.basename(filePath).replace(/\.yml$/, "")
			);

			itemIndex += 1;
			items.push({
				itemIndex,
				stage,
				slug,
				filePath,
				stageIndex
			});
		}
	}

	const experienceFiles = await listYamlFiles("experiences");

	for (const [stageIndex, filePath] of experienceFiles.entries()) {
		const raw = await readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSlugFromRaw(
			raw,
			path.basename(filePath).replace(/\.yml$/, "")
		);

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "experiences",
			slug,
			filePath,
			stageIndex
		});
	}

	for (const [stageIndex, filePath] of experienceFiles.entries()) {
		const raw = await readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSlugFromRaw(
			raw,
			path.basename(filePath).replace(/\.yml$/, "")
		);

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "experiencePatches",
			slug: `${slug}:relations`,
			filePath,
			stageIndex
		});
	}

	const routeFiles = await listYamlFiles("routes");

	for (const [stageIndex, filePath] of routeFiles.entries()) {
		const raw = await readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSlugFromRaw(
			raw,
			path.basename(filePath).replace(/\.yml$/, "")
		);

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "routes",
			slug,
			filePath,
			stageIndex
		});
	}

	for (const [stageIndex, filePath] of routeFiles.entries()) {
		const raw = await readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSlugFromRaw(
			raw,
			path.basename(filePath).replace(/\.yml$/, "")
		);

		itemIndex += 1;
		items.push({
			itemIndex,
			stage: "routePatches",
			slug: `${slug}:relations`,
			filePath,
			stageIndex
		});
	}

	const mapPointsPath = path.join(CONTENT_DIR, "map-points.yml");

	try {
		const mapPoints =
			await readYamlFile<Record<string, unknown>[]>(mapPointsPath);

		for (const [stageIndex, mapPoint] of mapPoints.entries()) {
			const route =
				typeof mapPoint.route === "string" ? mapPoint.route : "unknown";
			const order =
				typeof mapPoint.order === "number" ? mapPoint.order : stageIndex;

			itemIndex += 1;
			items.push({
				itemIndex,
				stage: "mapPoints",
				slug: `${route}#${String(order)}`,
				filePath: mapPointsPath,
				stageIndex,
				mapPoint
			});
		}
	} catch {
		// optional file
	}

	const routesHubPath = path.join(CONTENT_DIR, "routes-hub.yml");
	itemIndex += 1;
	items.push({
		itemIndex,
		stage: "routesHub",
		slug: "routes-hub",
		filePath: routesHubPath,
		stageIndex: 0
	});

	const experiencesHubPath = path.join(CONTENT_DIR, "experiences-hub.yml");
	itemIndex += 1;
	items.push({
		itemIndex,
		stage: "experiencesHub",
		slug: "experiences-hub",
		filePath: experiencesHubPath,
		stageIndex: 0
	});

	for (const stage of ["tradeFairs", "blog", "news"] as const) {
		const files = await listYamlFiles(stage === "tradeFairs" ? "trade-fairs" : stage);

		for (const [stageIndex, filePath] of files.entries()) {
			const raw = await readYamlFile<Record<string, unknown>>(filePath);
			const slug = resolveSlugFromRaw(
				raw,
				path.basename(filePath).replace(/\.yml$/, "")
			);

			itemIndex += 1;
			items.push({
				itemIndex,
				stage,
				slug,
				filePath,
				stageIndex
			});
		}
	}

	for (const [hubStage, hubSlug, hubFile] of [
		["tradeFairsHub", "trade-fairs-hub", "trade-fairs-hub.yml"],
		["blogHub", "blog-hub", "blog-hub.yml"],
		["newsHub", "news-hub", "news-hub.yml"]
	] as const) {
		itemIndex += 1;
		items.push({
			itemIndex,
			stage: hubStage,
			slug: hubSlug,
			filePath: path.join(CONTENT_DIR, hubFile),
			stageIndex: 0
		});
	}

	const refreshStages = [
		"refreshRouteMapCountries",
		"refreshRouteMapRegions",
		"refreshRouteMapCities",
		"refreshRouteMapAttractions"
	] as const;

	for (const [stageIndex, stage] of refreshStages.entries()) {
		itemIndex += 1;
		items.push({
			itemIndex,
			stage,
			slug: stage.replace("refreshRouteMap", "").toLowerCase(),
			filePath: CONTENT_DIR,
			stageIndex
		});
	}

	return { items, nextIndex: itemIndex };
}

export async function loadNeonSeedItems(): Promise<TNeonSeedItem[]> {
	const m1 = await buildMilestone1Items(0);
	const m2 = await loadMilestone2Items(m1.nextIndex);

	return [...m1.items, ...m2.items];
}

export async function loadMilestone1ItemsOnly(): Promise<TNeonSeedItem[]> {
	const m1 = await buildMilestone1Items(0);
	return m1.items;
}

export async function collectDryRunReport(): Promise<TDryRunReport> {
	const items = await loadNeonSeedItems();
	const stages = createEmptyStageCounts();

	for (const item of items) {
		stages[item.stage] += 1;
	}

	const yamlPaths = new Set<string>();

	for (const item of items) {
		if (item.filePath.endsWith(".yml")) {
			yamlPaths.add(item.filePath);
		}
	}

	yamlPaths.add(path.join(CONTENT_DIR, "routes-hub.yml"));
	yamlPaths.add(path.join(CONTENT_DIR, "experiences-hub.yml"));

	const mediaPaths = await collectMediaPathsForFiles([...yamlPaths]);

	return {
		stages,
		totalItems: items.length,
		mediaPaths,
		items
	};
}

export function printDryRunReport(report: TDryRunReport): void {
	console.log("Neon seed dry-run (no database writes)");
	console.log(`  source: ${CONTENT_DIR}`);
	console.log(`  total items: ${report.totalItems}`);
	console.log(`  milestone 1: badges=${report.stages.badges}, countries=${report.stages.countries}, regions=${report.stages.regions}, cities=${report.stages.cities}`);
	console.log(`  milestone 2: themes=${report.stages.themes}, attractions=${report.stages.attractions}, experiences=${report.stages.experiences}, experiencePatches=${report.stages.experiencePatches}, routes=${report.stages.routes}, routePatches=${report.stages.routePatches}`);
	console.log(`  map points: ${report.stages.mapPoints}`);
	console.log(`  globals: routesHub=${report.stages.routesHub}, experiencesHub=${report.stages.experiencesHub}`);
	console.log(`  refresh route map: countries=${report.stages.refreshRouteMapCountries}, regions=${report.stages.refreshRouteMapRegions}, cities=${report.stages.refreshRouteMapCities}, attractions=${report.stages.refreshRouteMapAttractions}`);
	console.log(`  unique media paths: ${report.mediaPaths.length}`);

	if (report.mediaPaths.length > 0) {
		const preview = report.mediaPaths.slice(0, 5);
		console.log(`  media preview: ${preview.join(", ")}`);

		if (report.mediaPaths.length > preview.length) {
			console.log(`  ... and ${report.mediaPaths.length - preview.length} more`);
		}
	}
}
