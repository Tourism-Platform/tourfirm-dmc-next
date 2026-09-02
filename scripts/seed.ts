import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

import "./load-env.js";

import { getPayload, type CollectionSlug, type Payload } from "payload";
import { parse as parseYaml } from "yaml";
import pg from "pg";

import type {
	Attraction,
	City,
	Country,
	Footer,
	Header,
	Media,
	Region
} from "@/payload-types";

import {
	mergeFooterColumnsById,
	mergeInformationAreasById,
	mergeNavItemsById
} from "@/cms/lib/merge-nav-items-by-id";
import {
	assertNoDeprecatedNavigationOrder,
	assertNoDeprecatedNavigationOrderInItems
} from "@/cms/lib/navigation-order-guard";
import { isPagePathGroup } from "@/shared/config/routes/page-path-groups";

import {
	normalizeRichTextDescriptions,
	toDefaultRichText
} from "./to-default-rich-text.js";
import { isMediaBroken } from "./helpers/media-validator.js";
import { checkMediaObjectExistsInStorage, putMediaObjectToStorage } from "./helpers/media-storage-check.js";
import {
	createSeedCostTracker,
	createSeedStageLogger,
	attachSeedPoolErrorHandler,
	logSeedConnectionInfo,
	preloadMediaDbIndex,
	resolveSeedDatabaseUri,
	retrySeedOperation,
	type TMediaDbIndex,
	wakeDatabase,
	waitWithHeartbeat
} from "./seed-timing.js";
import {
	createSeedProfiler,
	type TSeedProfileCategory,
	type TSeedProfiler
} from "./seed-profiler.js";
import { SeedLookupCache } from "./seed-lookup-cache.js";
import {
	isSeedFullReset,
	logSeedResetMode,
	resetDatabase,
	shouldPreserveMediaOnFastReset,
	shouldSkipDatabaseReset,
	shouldSkipExistingDocs
} from "./seed-reset.js";
import { createDiscoverySeeder } from "./seed-discovery.js";
import { seedUiContent } from "./seed-ui-content.js";
import { seedToursPage } from "./seed/seeders/tours-page.js";
import { mapWithConcurrency, SEED_LIMITS } from "./seed-parallel.js";
import { SUPPORTED_LOCALES, type TSupportedLocale } from "../config/supported-locales.js";

const SEED_STAGE_COUNT = 21;

type TLocale = TSupportedLocale;

function resolveSeedLocales(): readonly TLocale[] {
	const raw = process.env.SEED_LOCALES?.trim();

	if (!raw) {
		return SUPPORTED_LOCALES;
	}

	const requested = raw
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	const allowed = new Set<string>(SUPPORTED_LOCALES);
	const locales = requested.filter((code): code is TLocale =>
		allowed.has(code)
	);

	if (locales.length === 0) {
		throw new Error(
			`SEED_LOCALES must include at least one of: ${SUPPORTED_LOCALES.join(", ")}`
		);
	}

	return locales;
}

function resolveLocalesWithContent(
	raw: Record<string, unknown>,
	locales: readonly TLocale[]
): TLocale[] {
	return locales.filter((locale) => rawHasLocaleContent(raw, locale));
}

function logSeedPerformanceSettings(): void {
	const locales = resolveSeedLocales();
	const preserveMedia = shouldPreserveMediaOnFastReset();
	const resume = shouldSkipDatabaseReset();

	console.log(
		`Seed perf: resume=${resume} locales=[${locales.join(",")}] preserveMedia=${preserveMedia} concurrency=${JSON.stringify(SEED_LIMITS)}`
	);
}

type TRouteMapCollection =
	| "countries"
	| "regions"
	| "cities"
	| "attractions";

const ROUTE_MAP_CONTENT_DIRS: Record<TRouteMapCollection, string> = {
	countries: "countries",
	regions: "regions",
	cities: "cities",
	attractions: "attractions"
};

const ROUTE_MAP_SQL_TABLES: Record<
	TRouteMapCollection,
	{
		locales: string;
		routeMap: string;
		stops: string;
		rels: string;
	}
> = {
	countries: {
		locales: "countries_locales",
		routeMap: "countries_blocks_route_map",
		stops: "countries_blocks_route_map_stops",
		rels: "countries_rels"
	},
	regions: {
		locales: "regions_locales",
		routeMap: "regions_blocks_route_map",
		stops: "regions_blocks_route_map_stops",
		rels: "regions_rels"
	},
	cities: {
		locales: "cities_locales",
		routeMap: "cities_blocks_route_map",
		stops: "cities_blocks_route_map_stops",
		rels: "cities_rels"
	},
	attractions: {
		locales: "attractions_locales",
		routeMap: "attractions_blocks_route_map",
		stops: "attractions_blocks_route_map_stops",
		rels: "attractions_rels"
	}
};

const ENTITY_REL_COLUMN: Record<
	"country" | "region" | "city" | "attraction",
	string
> = {
	country: "countries_id",
	region: "regions_id",
	city: "cities_id",
	attraction: "attractions_id"
};

async function mapPool<T>(
	items: T[],
	concurrency: number,
	worker: (item: T) => Promise<void>
): Promise<void> {
	let nextIndex = 0;

	const runners = Array.from(
		{ length: Math.max(1, Math.min(concurrency, items.length || 1)) },
		async () => {
			while (nextIndex < items.length) {
				const current = nextIndex;
				nextIndex += 1;
				await worker(items[current]);
			}
		}
	);

	await Promise.all(runners);
}

const LOCALES = SUPPORTED_LOCALES;

const SEED_CONTEXT = { isSeed: true } as const;

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: SEED_CONTEXT
};

type TResolvePageOptions = {
	hrefPrefix?: string;
	deferRouteMapStops?: boolean;
	/** Skip country/relatedDoc cards when lookup misses (globals-only Neon seed). */
	skipMissingRelations?: boolean;
	fileFilter?: (file: string) => boolean;
};

function isCompanyPageSeedFile(file: string): boolean {
	return file === "company-about.yml" || file.startsWith("company-team-");
}

function buildPrefixedCountryHref(
	hrefPrefix: string | undefined,
	countrySlug: string
): string {
	return hrefPrefix ? `/${hrefPrefix}/${countrySlug}` : `/${countrySlug}`;
}

function resolveBlockActions(
	actions: unknown,
	hrefPrefix?: string
): unknown {
	if (!hrefPrefix || !Array.isArray(actions)) {
		return actions;
	}

	return actions.map((action) => {
		if (!action || typeof action !== "object") {
			return action;
		}

		const entry = action as Record<string, unknown>;

		if (entry.type === "link" && typeof entry.href === "string") {
			const href = entry.href;

			if (
				!href.startsWith("#") &&
				!href.startsWith("/") &&
				!href.includes("://")
			) {
				return {
					...entry,
					href: buildPrefixedCountryHref(hrefPrefix, href)
				};
			}
		}

		return action;
	});
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CONTENT_DIR = path.join(ROOT, "content");
const SEED_LOCK_PATH = path.join(ROOT, ".seed.lock");
const MEDIA_UPLOAD_DIR = "media/uploads";
// Payload `upload.staticDir` resolves to `<root>/media/uploads`.
// Also reset `public/media/uploads` leftovers from static serving.

type TMediaCache = Map<string, Media>;

const inFlightMedia = new Map<string, Promise<Media>>();

let activeLookup = new SeedLookupCache();
let activeMediaDbIndex: TMediaDbIndex | undefined;
let activeProfiler: TSeedProfiler | undefined;
let isCleanMediaRun = true;

export function setSeedRuntimeContext(
	lookup: SeedLookupCache,
	mediaDbIndex?: TMediaDbIndex,
	profiler?: TSeedProfiler
): void {
	activeLookup = lookup;
	activeMediaDbIndex = mediaDbIndex;
	activeProfiler = profiler;
}

function markSeedRetry(): void {
	isCleanMediaRun = false;
}

async function profileRun<T>(
	category: TSeedProfileCategory,
	operation: () => Promise<T>
): Promise<T> {
	if (activeProfiler) {
		return activeProfiler.run(category, operation);
	}

	return operation();
}

function isSourcePathUniqueViolation(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const payloadError = error as {
		message?: string;
		data?: { errors?: { path?: string }[] };
	};

	if (
		payloadError.data?.errors?.some(
			(entry) => entry.path === "sourcePath"
		)
	) {
		return true;
	}

	return String(payloadError.message ?? "").includes("sourcePath");
}

function isFilenameValidationError(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const payloadError = error as {
		message?: string;
		data?: { errors?: { path?: string }[] };
	};

	if (
		payloadError.data?.errors?.some((entry) => entry.path === "filename")
	) {
		return true;
	}

	return String(payloadError.message ?? "")
		.toLowerCase()
		.includes("filename");
}

function logMediaUrlDiagnostic(media: Media): void {
	const rawUrl = typeof media.url === "string" ? media.url : "";
	let hostname = "(relative)";
	let protocol = "(relative)";

	if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
		try {
			const parsed = new URL(rawUrl);
			hostname = parsed.hostname;
			protocol = parsed.protocol.replace(":", "");
		} catch {
			hostname = "(invalid-url)";
			protocol = "(invalid-url)";
		}
	}

	console.log("MEDIA_CREATE_DIAGNOSTIC", {
		id: media.id,
		filename: media.filename ?? "(empty)",
		url: rawUrl || "(empty)",
		hostname,
		protocol
	});
}

async function findMediaBySourcePath(
	payload: Payload,
	sourcePath: string
): Promise<Media | null> {
	const indexed = activeMediaDbIndex?.get(sourcePath);

	if (indexed !== undefined) {
		return {
			id: indexed.id,
			sourcePath,
			url: indexed.url ?? null,
			filename: indexed.filename ?? null,
			updatedAt: "",
			createdAt: ""
		} as Media;
	}

	if (isCleanMediaRun) {
		return null;
	}

	const existing = await payload.find({
		collection: "media",
		where: {
			sourcePath: {
				equals: sourcePath
			}
		},
		limit: 1,
		pagination: false,
		depth: 0,
		...SEED_OP_OPTS
	});

	return existing.docs[0] ?? null;
}

async function findMediaByFilename(
	payload: Payload,
	filename: string
): Promise<Media | null> {
	const existing = await payload.find({
		collection: "media",
		where: {
			filename: {
				equals: filename
			}
		},
		limit: 1,
		pagination: false,
		depth: 0,
		...SEED_OP_OPTS
	});

	return existing.docs[0] ?? null;
}

function isLocalizedValue(
	value: unknown
): value is Record<TLocale, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const record = value as Record<string, unknown>;
	const keys = Object.keys(record);

	if (keys.length === 0) {
		return false;
	}

	return keys.every((key) => (LOCALES as readonly string[]).includes(key));
}

export function pickLocale(value: unknown, locale: TLocale): unknown {
	if (isLocalizedValue(value)) {
		return value[locale];
	}

	if (Array.isArray(value)) {
		return value.map((item) => pickLocale(item, locale));
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, item]) => [
				key,
				pickLocale(item, locale)
			])
		);
	}

	return value;
}

function rawHasLocaleContent(value: unknown, locale: TLocale): boolean {
	if (isLocalizedValue(value)) {
		const localized = (value as Record<string, unknown>)[locale];

		if (localized === null || localized === undefined || localized === "") {
			return false;
		}

		if (typeof localized === "object") {
			return rawHasLocaleContent(localized, locale);
		}

		return true;
	}

	if (Array.isArray(value)) {
		return value.some((item) => rawHasLocaleContent(item, locale));
	}

	if (value && typeof value === "object") {
		return Object.values(value as Record<string, unknown>).some((item) =>
			rawHasLocaleContent(item, locale)
		);
	}

	return false;
}

export async function readYamlFile<T>(filePath: string): Promise<T> {
	const raw = await fs.readFile(filePath, "utf8");
	return parseYaml(raw) as T;
}

async function resetMediaFolderContents(): Promise<void> {
	// Payload `upload.staticDir` is `media/uploads` (project root).
	// Also clear `public/media/uploads` used for static serving leftovers.
	const paths = [
		path.join(ROOT, MEDIA_UPLOAD_DIR),
		path.join(ROOT, "public", MEDIA_UPLOAD_DIR)
	];

	console.log("Resetting media upload directories...");

	for (const mediaPath of paths) {
		await fs.mkdir(mediaPath, { recursive: true });

		const entries = await fs.readdir(mediaPath, { withFileTypes: true });

		for (const entry of entries) {
			await fs.rm(path.join(mediaPath, entry.name), {
				recursive: true,
				force: true
			});
		}
	}

	console.log("Media upload directories reset complete");
}

function clearCaches(): void {
	inFlightMedia.clear();
}

function isProcessAlive(pid: number): boolean {
	if (!Number.isInteger(pid) || pid <= 0) {
		return false;
	}

	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		const code = (error as NodeJS.ErrnoException).code;

		return code !== "ESRCH";
	}
}

async function acquireSeedLock(): Promise<void> {
	try {
		const handle = await fs.open(SEED_LOCK_PATH, "wx");
		await handle.writeFile(String(process.pid));
		await handle.close();
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "EEXIST") {
			const existingPidRaw = await fs
				.readFile(SEED_LOCK_PATH, "utf8")
				.catch(() => "");
			const existingPid = Number.parseInt(existingPidRaw.trim(), 10);

			if (!isProcessAlive(existingPid)) {
				console.warn(
					`  ! removing stale seed lock (pid ${existingPidRaw.trim() || "unknown"} not running)`
				);
				await fs.unlink(SEED_LOCK_PATH).catch(() => undefined);
				return acquireSeedLock();
			}

			throw new Error(
				`Seed already running (lock .seed.lock, pid ${existingPidRaw.trim()}). Stop the other process first.`
			);
		}

		throw error;
	}
}

async function releaseSeedLock(): Promise<void> {
	await fs.unlink(SEED_LOCK_PATH).catch(() => undefined);
}

export function resolveSeedSlug(raw: Record<string, unknown>): string | undefined {
	const slug = raw.slug;

	if (typeof slug === "string" && slug.length > 0) {
		return slug;
	}

	if (slug && typeof slug === "object" && slug !== null && "en" in slug) {
		const en = (slug as Record<string, unknown>).en;

		if (typeof en === "string" && en.length > 0) {
			return en;
		}
	}

	return undefined;
}

export async function findSeedDocBySlug(
	payload: Payload,
	collection: CollectionSlug,
	slug: string
): Promise<{ id: number | string } | null> {
	const result = await payload.find({
		collection,
		where: { slug: { equals: slug } },
		limit: 1,
		depth: 0,
		locale: "en",
		...SEED_OP_OPTS
	});

	const doc = result.docs[0];

	return doc ? { id: doc.id as number | string } : null;
}

function logPayloadInitContext(): void {
	const pushEnabled = process.env.PAYLOAD_DB_PUSH !== "false";
	const isProduction = process.env.NODE_ENV === "production";
	const isMigrating = process.env.PAYLOAD_MIGRATING === "true";

	console.log(
		"  Payload init context: push=%s, NODE_ENV=%s, PAYLOAD_MIGRATING=%s",
		pushEnabled ? "enabled" : "disabled",
		process.env.NODE_ENV ?? "(unset)",
		isMigrating ? "true" : "false"
	);

	if (pushEnabled && !isProduction && !isMigrating) {
		console.log(
			"  Schema sync: drizzle pushSchema runs inside getPayload (no separate migrations in repo)"
		);
		console.log(
			"  After schema pull, DDL apply may run silently until Payload is ready"
		);
	}
}

async function createMediaRecord(
	payload: Payload,
	sourcePath: string
): Promise<{ kind: "created" | "existing"; media: Media }> {
	const filePath = path.join(ROOT, "public", sourcePath);

	try {
		const created = await profileRun("media_upload", () =>
			payload.create({
				collection: "media",
				data: {
					sourcePath,
					alt: path.basename(sourcePath, path.extname(sourcePath))
				},
				filePath,
				// Keep storage key = basename(sourcePath). Avoids getSafeFileName
				// collisions against leftover DB/FS names (kirgizstan-1.jpg etc).
				overwriteExistingFiles: true,
				...SEED_OP_OPTS
			})
		);
		console.log(`↑ upload new media: ${sourcePath}`);
		logMediaUrlDiagnostic(created as Media);
		return { kind: "created", media: created as Media };
	} catch (error) {
		if (isSourcePathUniqueViolation(error)) {
			const existing = await findMediaBySourcePath(payload, sourcePath);

			if (!existing) {
				throw error;
			}

			return { kind: "existing", media: existing };
		}

		// Same basename under different folders (e.g. samarkand.jpg vs city/samarkand.jpg).
		if (isFilenameValidationError(error)) {
			const filename = path.basename(sourcePath);
			const existing = await findMediaByFilename(payload, filename);

			if (!existing) {
				throw error;
			}

			console.log(
				`  ~ reuse media by filename ${filename} for ${sourcePath}`
			);
			return { kind: "existing", media: existing };
		}

		throw error;
	}
}

async function repairMediaRecord(
	payload: Payload,
	existing: Media,
	sourcePath: string
): Promise<Media> {
	const filePath = path.join(ROOT, "public", sourcePath);
	// overwriteExistingFiles keeps Media.filename stable so S3 key matches the
	// document (avoids getSafeFileName collision → name-1.ext).
	const repaired = await profileRun("media_upload", () =>
		payload.update({
			collection: "media",
			id: existing.id,
			data: {
				sourcePath,
				alt:
					typeof existing.alt === "string" && existing.alt.length > 0
						? existing.alt
						: path.basename(sourcePath, path.extname(sourcePath))
			},
			filePath,
			overwriteExistingFiles: true,
			...SEED_OP_OPTS
		})
	);

	console.log(`↻ repair broken media: ${sourcePath}`);
	logMediaUrlDiagnostic(repaired as Media);
	return repaired as Media;
}

function cacheMediaEntry(
	mediaCache: TMediaCache,
	sourcePath: string,
	media: Media
): void {
	mediaCache.set(sourcePath, media);
	activeMediaDbIndex?.set(sourcePath, {
		id: media.id as number,
		url: media.url,
		filename: media.filename
	});
}

/**
 * Validate existing Media: url present + S3/R2 object exists (HeadObject).
 * HeadObject runs only for existing records, never after a fresh create.
 */
async function ensureExistingMedia(
	payload: Payload,
	mediaCache: TMediaCache,
	sourcePath: string,
	existing: Media
): Promise<Media> {
	const validation = isMediaBroken(existing);

	if (!validation.isBroken) {
		const storage = await checkMediaObjectExistsInStorage(
			existing,
			sourcePath
		);

		if (storage.exists) {
			console.log(`✓ existing valid media: ${sourcePath}`);
			cacheMediaEntry(mediaCache, sourcePath, existing);
			return existing;
		}

		console.log(
			`  ! storage object missing for ${sourcePath} (key=${storage.key}) — repairing`
		);
	} else {
		console.log(
			`  ! broken media record for ${sourcePath}: ${validation.reason ?? "unknown"}`
		);
	}

	const repaired = await repairMediaRecord(payload, existing, sourcePath);
	const repairedValidation = isMediaBroken(repaired);

	if (repairedValidation.isBroken) {
		throw new Error(
			`Media repair failed for ${sourcePath}: ${repairedValidation.reason ?? "unknown reason"}`
		);
	}

	const afterRepair = await checkMediaObjectExistsInStorage(
		repaired,
		sourcePath
	);

	if (!afterRepair.exists) {
		const filePath = path.join(ROOT, "public", sourcePath);
		console.log(
			`  ! repair still missing in storage for ${sourcePath} — PutObject fallback`
		);
		await putMediaObjectToStorage(repaired, filePath, sourcePath);
	}

	cacheMediaEntry(mediaCache, sourcePath, repaired);
	return repaired;
}

async function ensureMediaOnce(
	payload: Payload,
	mediaCache: TMediaCache,
	sourcePath: string
): Promise<Media> {
	const cached = mediaCache.get(sourcePath);

	if (cached) {
		return cached;
	}

	const existing = await findMediaBySourcePath(payload, sourcePath);

	if (existing) {
		return ensureExistingMedia(payload, mediaCache, sourcePath, existing);
	}

	const created = await createMediaRecord(payload, sourcePath);

	// Unique race / filename reuse: validate as existing (may need repair).
	if (created.kind === "existing") {
		return ensureExistingMedia(
			payload,
			mediaCache,
			sourcePath,
			created.media
		);
	}

	// Fresh create: verify object actually landed in storage (filePath uploads
	// can succeed in DB while S3 put is missing — catch that here).
	const storage = await checkMediaObjectExistsInStorage(
		created.media,
		sourcePath
	);

	if (!storage.exists) {
		console.log(
			`  ! fresh media missing in storage for ${sourcePath} (key=${storage.key}) — PutObject fallback`
		);
		const filePath = path.join(ROOT, "public", sourcePath);
		await putMediaObjectToStorage(created.media, filePath, sourcePath);
		cacheMediaEntry(mediaCache, sourcePath, created.media);
		return created.media;
	}

	cacheMediaEntry(mediaCache, sourcePath, created.media);
	return created.media;
}

export async function ensureMedia(
	payload: Payload,
	mediaCache: TMediaCache,
	sourcePath: string
): Promise<Media> {
	const cached = mediaCache.get(sourcePath);

	if (cached) {
		return cached;
	}

	const pending = inFlightMedia.get(sourcePath);

	if (pending) {
		return pending;
	}

	const operation = ensureMediaOnce(payload, mediaCache, sourcePath).finally(
		() => {
			inFlightMedia.delete(sourcePath);
		}
	);

	inFlightMedia.set(sourcePath, operation);
	return operation;
}

async function resolveCardImage(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result = { ...card };

	if (typeof result.image === "string") {
		result.image = (await ensureMedia(payload, mediaCache, result.image)).id;
	}

	return result;
}

async function resolveRouteIdeaCard(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const { countrySlug, ...rest } = card;
	const resolved = await resolveCardImage(payload, mediaCache, rest);

	if (typeof countrySlug === "string") {
		return {
			...resolved,
			ctaHref: buildPrefixedCountryHref(options?.hrefPrefix, countrySlug)
		};
	}

	return resolved;
}

async function resolveCountryCard(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>,
	locale?: TLocale,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const { countrySlug, ...rest } = card;

	if (typeof countrySlug !== "string") {
		throw new Error(`Country card must include countrySlug in locale ${locale}`);
	}

	const country = activeLookup.getCountryCard(countrySlug);
	const slug = String(country.slug);
	const excerpt =
		typeof country.excerpt === "string"
			? toDefaultRichText(country.excerpt)
			: country.excerpt;

	return resolveCardImage(payload, mediaCache, {
		...rest,
		type: "country",
		href:
			typeof rest.href === "string" && rest.href.length > 0
				? rest.href
				: buildPrefixedCountryHref(options?.hrefPrefix, slug),
		image: rest.image ?? country.heroImage,
		badge: rest.badge ?? country.subtitle,
		title: rest.title ?? country.title,
		description:
			rest.description !== undefined && rest.description !== ""
				? rest.description
				: excerpt,
		featured: rest.featured === true,
		cities: rest.cities ?? []
	});
}

async function resolveBlockCards(
	payload: Payload,
	mediaCache: TMediaCache,
	cards: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	const CARD_TYPE_COLLECTION: Record<string, string> = {
		tradeFair: "trade-fairs",
		blog: "blog",
		journal: "blog",
		news: "news",
		route: "routes",
		experience: "experiences"
	};
	const resolved: unknown[] = [];

	for (const card of cards) {
		if (!card || typeof card !== "object") {
			resolved.push(card);
			continue;
		}

		const entry = card as Record<string, unknown>;

		if (entry.type === "country" && entry.countrySlug) {
			try {
				resolved.push(
					await resolveCountryCard(
						payload,
						mediaCache,
						entry,
						locale,
						options
					)
				);
			} catch (error) {
				if (!options?.skipMissingRelations) {
					throw error;
				}

				console.warn(
					`  ~ skip country card "${String(entry.countrySlug)}" (${error instanceof Error ? error.message : String(error)})`
				);
			}
			continue;
		}

		if (entry.type === "routeIdea") {
			resolved.push(
				await resolveRouteIdeaCard(payload, mediaCache, entry, options)
			);
			continue;
		}

		if (entry.type === "mosaicTile") {
			resolved.push(
				await resolveMosaicTileCard(
					payload,
					mediaCache,
					entry,
					options
				)
			);
			continue;
		}

		if (typeof entry.relatedDocSlug === "string") {
			const collection = CARD_TYPE_COLLECTION[String(entry.type)];

			if (!collection) {
				throw new Error(
					`relatedDocSlug is not supported for card type: ${String(entry.type)}`
				);
			}

			try {
				const id = activeLookup.getDiscoveryDocId(
					collection,
					entry.relatedDocSlug
				);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { relatedDocSlug: _slug, ...rest } = entry;

				resolved.push({
					...rest,
					relatedDoc: {
						relationTo: collection,
						value: id
					}
				});
			} catch (error) {
				if (!options?.skipMissingRelations) {
					throw error;
				}

				console.warn(
					`  ~ skip ${collection} card "${entry.relatedDocSlug}" (${error instanceof Error ? error.message : String(error)})`
				);
			}
			continue;
		}

		resolved.push(await resolveCardImage(payload, mediaCache, entry));
	}

	return resolved;
}

const ROUTE_MAP_ENTITY_COLLECTION = {
	country: "countries",
	region: "regions",
	city: "cities",
	attraction: "attractions"
} as const;

type TRouteMapEntityType = keyof typeof ROUTE_MAP_ENTITY_COLLECTION;

async function findRouteMapEntityId(
	entityType: TRouteMapEntityType,
	entitySlug: string
): Promise<number> {
	return activeLookup.getRouteMapEntityId(entityType, entitySlug);
}

const DEFAULT_DESTINATION_ROOT = "destinations";

function isRouteMapEntityType(value: string): value is TRouteMapEntityType {
	return (
		value === "country" ||
		value === "region" ||
		value === "city" ||
		value === "attraction"
	);
}

async function resolveMosaicTileCard(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const { entityType, entitySlug, ...rest } = card;
	const resolved = await resolveCardImage(payload, mediaCache, rest);

	if (typeof entityType !== "string" || typeof entitySlug !== "string") {
		return resolved;
	}

	if (!isRouteMapEntityType(entityType)) {
		throw new Error(
			`mosaicTile entityType is not supported: ${entityType}`
		);
	}

	try {
		const id = await findRouteMapEntityId(entityType, entitySlug);
		const rootSlug = options?.hrefPrefix ?? DEFAULT_DESTINATION_ROOT;

		return {
			...resolved,
			relatedDoc: {
				relationTo: ROUTE_MAP_ENTITY_COLLECTION[entityType],
				value: id
			},
			href: activeLookup.getGeoHref(entityType, entitySlug, rootSlug)
		};
	} catch (error) {
		if (!options?.skipMissingRelations) {
			throw error;
		}

		console.warn(
			`  ~ skip mosaicTile "${entityType}:${entitySlug}" (${error instanceof Error ? error.message : String(error)})`
		);

		return resolved;
	}
}

async function resolveRouteMapStops(
	stops: unknown[],
	options?: TResolvePageOptions
): Promise<unknown[]> {
	const resolved: unknown[] = [];

	for (const stop of stops) {
		if (!stop || typeof stop !== "object") {
			resolved.push(stop);
			continue;
		}

		const entry = { ...(stop as Record<string, unknown>) };
		const entityType = entry.entityType as TRouteMapEntityType | undefined;
		const entitySlug = entry.entitySlug;

		if (!entityType || typeof entitySlug !== "string") {
			resolved.push(entry);
			continue;
		}

		const collection = ROUTE_MAP_ENTITY_COLLECTION[entityType];

		try {
			const id = await findRouteMapEntityId(entityType, entitySlug);
			delete entry.entitySlug;
			resolved.push({
				...entry,
				relation: {
					relationTo: collection,
					value: id
				}
			});
		} catch (error) {
			if (!options?.skipMissingRelations) {
				throw error;
			}

			console.warn(
				`  ~ skip routeMap stop "${entityType}:${entitySlug}" (${error instanceof Error ? error.message : String(error)})`
			);
		}
	}

	return resolved;
}

async function resolvePageBlocks(
	payload: Payload,
	mediaCache: TMediaCache,
	blocks: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	const resolvedBlocks = await Promise.all(
		blocks.map(async (block) => {
			if (!block || typeof block !== "object") {
				return block;
			}

			const entry = { ...(block as Record<string, unknown>) };

			if (entry.blockType === "hero" || entry.blockType === "cta") {
				if (typeof entry.image === "string") {
					entry.image = (
						await ensureMedia(payload, mediaCache, entry.image)
					).id;
				}

				if (Array.isArray(entry.actions)) {
					entry.actions = resolveBlockActions(
						entry.actions,
						options?.hrefPrefix
					);
				}
			}

			if (Array.isArray(entry.cards)) {
				entry.cards = await resolveBlockCards(
					payload,
					mediaCache,
					entry.cards,
					locale,
					options
				);
			}

			if (Array.isArray(entry.rows)) {
				entry.rows = await Promise.all(
					(entry.rows as unknown[]).map(async (row) => {
						if (!row || typeof row !== "object") {
							return row;
						}

						const rowEntry = { ...(row as Record<string, unknown>) };

						if (Array.isArray(rowEntry.left)) {
							rowEntry.left = await resolveBlockCards(
								payload,
								mediaCache,
								rowEntry.left,
								locale,
								options
							);
						}

						if (Array.isArray(rowEntry.right)) {
							rowEntry.right = await resolveBlockCards(
								payload,
								mediaCache,
								rowEntry.right,
								locale,
								options
							);
						}

						return rowEntry;
					})
				);
			}

			if (entry.blockType === "routeMap" && Array.isArray(entry.stops)) {
				if (options?.deferRouteMapStops) {
					delete entry.stops;
				} else {
					entry.stops = await resolveRouteMapStops(
						entry.stops,
						options
					);
				}
			}

			if (entry.blockType === "itinerary" && Array.isArray(entry.items)) {
				entry.items = await Promise.all(
					(entry.items as unknown[]).map(async (item) => {
						if (!item || typeof item !== "object") {
							return item;
						}

						const row = { ...(item as Record<string, unknown>) };

						if (typeof row.image === "string") {
							row.image = (
								await ensureMedia(payload, mediaCache, row.image)
							).id;
						}

						return row;
					})
				);
			}

			return entry;
		})
	);

	return normalizeRichTextDescriptions(resolvedBlocks);
}

async function resolveTopLevelMedia(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result: Record<string, unknown> = { ...data };

	if (typeof result.heroImage === "string") {
		result.heroImage = (
			await ensureMedia(payload, mediaCache, result.heroImage)
		).id;
	}

	if (typeof result.coverImage === "string") {
		result.coverImage = (
			await ensureMedia(payload, mediaCache, result.coverImage)
		).id;
	}

	if (Array.isArray(result.gallery)) {
		const resolvedGallery: unknown[] = [];

		for (const item of result.gallery) {
			if (typeof item === "string") {
				resolvedGallery.push(
					(await ensureMedia(payload, mediaCache, item)).id
				);
			} else {
				resolvedGallery.push(item);
			}
		}

		result.gallery = resolvedGallery;
	}

	return result;
}

export async function resolveSeedDocument(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>,
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	return profileRun("resolve_seed_document", async () => {
		const withStatusDefaults = mergeStatusDefaults(data);
		const withTopLevelMedia = await resolveTopLevelMedia(
			payload,
			mediaCache,
			withStatusDefaults
		);

		if (!Array.isArray(withTopLevelMedia.blocks)) {
			return withTopLevelMedia;
		}

		return {
			...withTopLevelMedia,
			blocks: await resolvePageBlocks(
				payload,
				mediaCache,
				withTopLevelMedia.blocks,
				locale,
				options
			)
		};
	});
}

function mergeStatusDefaults(
	data: Record<string, unknown>
): Record<string, unknown> {
	const rawStatus =
		data.status && typeof data.status === "object" && !Array.isArray(data.status)
			? (data.status as Record<string, unknown>)
			: {};

	return {
		...data,
		status: {
			showInSitemap: true,
			showInHeader: true,
			showInFooter: true,
			...rawStatus
		}
	};
}

async function readDestinationPageSlug(): Promise<string> {
	const filePath = path.join(CONTENT_DIR, "destination-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);
	const slug = raw.slug;

	if (typeof slug === "object" && slug !== null && "en" in slug) {
		return String((slug as Record<string, unknown>).en);
	}

	return String(slug ?? "");
}

async function readDestinationSlugFromDb(payload: Payload): Promise<string> {
	try {
		const doc = await payload.findGlobal({
			slug: "destination",
			locale: "en",
			depth: 0,
			overrideAccess: true
		});
		const slug =
			doc && typeof doc === "object" && "slug" in doc
				? String((doc as { slug?: string }).slug ?? "").trim()
				: "";

		return slug || DEFAULT_DESTINATION_ROOT;
	} catch {
		return DEFAULT_DESTINATION_ROOT;
	}
}

export async function seedDiscoveryGlobal(
	payload: Payload,
	slug:
		| "routes-hub"
		| "experiences-hub"
		| "trade-fairs-hub"
		| "blog-hub"
		| "news-hub",
	raw: Record<string, unknown>,
	mediaCache: TMediaCache
): Promise<void> {
	const locales = resolveSeedLocales();
	const localesWithContent = resolveLocalesWithContent(raw, locales);

	for (const locale of localesWithContent) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale
		);

		await payload.updateGlobal({
			slug,
			data,
			locale,
			...SEED_OP_OPTS
		});

		console.log(`  + ${slug} locale ${locale}`);
	}
}

async function seedHomepage(
	payload: Payload,
	mediaCache: TMediaCache,
	navigationRootSlug: string
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "main-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding homepage global...");

	const locales = resolveSeedLocales();
	const localesWithContent = resolveLocalesWithContent(raw, locales);

	for (const locale of localesWithContent) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale,
			{ hrefPrefix: navigationRootSlug }
		);

		await payload.updateGlobal({
			slug: "homepage",
			data,
			locale,
			...SEED_OP_OPTS
		});

		console.log(`  + homepage locale ${locale}`);
	}
}

async function seedDestination(
	payload: Payload,
	mediaCache: TMediaCache
): Promise<string> {
	const filePath = path.join(CONTENT_DIR, "destination-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding destination global...");

	const pageSlug = await readDestinationPageSlug();
	const localesWithContent = resolveLocalesWithContent(
		raw,
		resolveSeedLocales()
	);

	for (const locale of localesWithContent) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale,
			{ hrefPrefix: pageSlug }
		);

		await payload.updateGlobal({
			slug: "destination",
			data,
			locale,
			...SEED_OP_OPTS
		});

		console.log(`  + destination locale ${locale}`);
	}

	return pageSlug;
}

export function resolveBadgeIds(
	data: Record<string, unknown>,
	badgeIds: Map<string, number>
): Record<string, unknown> {
	if (!Array.isArray(data.badges)) {
		return data;
	}

	return {
		...data,
		badges: data.badges.map((slug) => {
			if (typeof slug !== "string") {
				throw new Error(`Badge slug must be a string, got ${typeof slug}`);
			}

			const id = badgeIds.get(slug);
			if (!id) {
				throw new Error(`Badge not found: ${slug}`);
			}

			return id;
		})
	};
}

const FEATURED_NAV_BADGES = new Set(["FEATURED", "TOP_PICK"]);

export function applyGeoNavOrder(
	data: Record<string, unknown>,
	index: number
): Record<string, unknown> {
	if (data.navOrder != null) {
		return data;
	}

	const badges = data.badges;
	const isFeatured =
		Array.isArray(badges) &&
		badges.some(
			(badge) => typeof badge === "string" && FEATURED_NAV_BADGES.has(badge)
		);

	return {
		...data,
		navOrder: isFeatured ? -1 : index
	};
}

async function findCountryIdBySlug(countrySlug: string): Promise<number> {
	return activeLookup.getCountryId(countrySlug);
}

async function findRegionIdBySlug(
	countryId: number,
	regionSlug: string
): Promise<number> {
	return activeLookup.getRegionId(countryId, regionSlug);
}

async function findCityIdBySlug(
	regionId: number,
	citySlug: string
): Promise<number> {
	return activeLookup.getCityId(regionId, citySlug);
}

export async function resolveRegionSeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(result.country);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
		deferRouteMapStops: true
	});
}

export async function resolveCitySeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(result.country);
	}

	if (typeof result.region === "string") {
		const countryId = result.country as number;

		result.region = await findRegionIdBySlug(
			countryId,
			result.region
		);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
		deferRouteMapStops: true
	});
}

export async function resolveAttractionSeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(result.country);
	}

	const countryId = result.country as number;

	if (typeof result.region === "string") {
		result.region = await findRegionIdBySlug(
			countryId,
			result.region
		);
	}

	const regionId = result.region as number;

	if (typeof result.city === "string") {
		result.city = await findCityIdBySlug(regionId, result.city);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
		deferRouteMapStops: true
	});
}

export async function seedLocalizedDocOnce(
	payload: Payload,
	collection: CollectionSlug,
	raw: Record<string, unknown>,
	options?: {
		published?: boolean;
		skipSlugLookup?: boolean;
		locales?: readonly TLocale[];
		beforeCreate?: (
			data: Record<string, unknown>,
			locale: TLocale
		) => Promise<Record<string, unknown>>;
	}
): Promise<{ id: number | string; createdDoc?: Record<string, unknown> }> {
	const beforeCreate = options?.beforeCreate ?? (async (data) => data);
	const localesToSeed = options?.locales ?? resolveSeedLocales();
	const localesWithContent = resolveLocalesWithContent(raw, localesToSeed);
	const primaryLocale = localesWithContent.includes("en")
		? "en"
		: localesWithContent[0];

	if (!primaryLocale) {
		throw new Error(`No locales to seed for ${collection}`);
	}

	const slug = resolveSeedSlug(raw);
	let doc =
		!options?.skipSlugLookup && slug
			? await findSeedDocBySlug(payload, collection, slug)
			: null;
	let createdDoc: Record<string, unknown> | undefined;

	if (doc && shouldSkipExistingDocs()) {
		console.log(
			`  ~ exists ${collection}${slug ? ` ${slug}` : ""} (id=${doc.id}), skip write`
		);
		return { id: doc.id };
	}

	if (!doc) {
		const primaryData = mergeStatusDefaults(
			await beforeCreate(
				pickLocale(raw, primaryLocale) as Record<string, unknown>,
				primaryLocale
			)
		);

		if (options?.published) {
			primaryData._status = "published";
		}

		const created = await profileRun("payload_create", () =>
			payload.create({
				collection,
				data: primaryData,
				locale: primaryLocale,
				draft: false,
				...SEED_OP_OPTS
			})
		);

		doc = created;
		createdDoc = created as unknown as Record<string, unknown>;
	} else if (rawHasLocaleContent(raw, primaryLocale)) {
		// Re-seed path: update primary locale on existing docs
		const primaryData = mergeStatusDefaults(
			await beforeCreate(
				pickLocale(raw, primaryLocale) as Record<string, unknown>,
				primaryLocale
			)
		);

		if (options?.published) {
			primaryData._status = "published";
		}

		await profileRun("payload_update_locales", () =>
			payload.update({
				collection,
				id: doc!.id,
				data: primaryData,
				locale: primaryLocale,
				...SEED_OP_OPTS
			})
		);
	}

	for (const locale of localesWithContent) {
		if (locale === primaryLocale) {
			continue;
		}

		const localeData = mergeStatusDefaults(
			await beforeCreate(
				pickLocale(raw, locale) as Record<string, unknown>,
				locale
			)
		);

		await profileRun("payload_update_locales", () =>
			payload.update({
				collection,
				id: doc!.id,
				data: localeData,
				locale,
				...SEED_OP_OPTS
			})
		);
	}

	return { id: doc.id, createdDoc };
}

export async function seedLocalizedDoc(
	payload: Payload,
	collection: CollectionSlug,
	raw: Record<string, unknown>,
	options?: {
		published?: boolean;
		locales?: readonly TLocale[];
		beforeCreate?: (
			data: Record<string, unknown>,
			locale: TLocale
		) => Promise<Record<string, unknown>>;
	}
): Promise<{ id: number | string; createdDoc?: Record<string, unknown> }> {
	const slug = resolveSeedSlug(raw);
	const label = `seed ${collection}${slug ? ` (${slug})` : ""}`;

	return retrySeedOperation((attempt) => {
		if (attempt > 1) {
			markSeedRetry();
		}

		return seedLocalizedDocOnce(payload, collection, raw, options);
	}, label);
}

function toRelationshipId(value: unknown): number | undefined {
	if (typeof value === "number") {
		return value;
	}

	if (value && typeof value === "object" && "id" in value) {
		const id = (value as { id: unknown }).id;

		return typeof id === "number" ? id : undefined;
	}

	return undefined;
}

export function registerCountryFromDoc(
	lookup: SeedLookupCache,
	doc: Record<string, unknown>
): void {
	const slug = typeof doc.slug === "string" ? doc.slug : undefined;

	if (!slug) {
		return;
	}

	lookup.registerCountry({
		id: doc.id as number,
		slug,
		heroImage: doc.heroImage as Country["heroImage"],
		subtitle: doc.subtitle as Country["subtitle"],
		title: doc.title as Country["title"],
		excerpt: doc.excerpt as Country["excerpt"]
	});
}

export function registerRegionFromDoc(
	lookup: SeedLookupCache,
	doc: Record<string, unknown>
): void {
	const slug = typeof doc.slug === "string" ? doc.slug : undefined;
	const countryId = toRelationshipId(doc.country);

	if (!slug || countryId === undefined) {
		return;
	}

	lookup.registerRegion(countryId, slug, doc.id as number);
}

export function registerCityFromDoc(
	lookup: SeedLookupCache,
	doc: Record<string, unknown>
): void {
	const slug = typeof doc.slug === "string" ? doc.slug : undefined;
	const regionId = toRelationshipId(doc.region);

	if (!slug || regionId === undefined) {
		return;
	}

	lookup.registerCity(regionId, slug, doc.id as number);
}

export function registerAttractionFromDoc(
	lookup: SeedLookupCache,
	doc: Record<string, unknown>
): void {
	const slug = typeof doc.slug === "string" ? doc.slug : undefined;

	if (!slug) {
		return;
	}

	lookup.registerAttraction(
		slug,
		doc.id as number,
		toRelationshipId(doc.city)
	);
}

async function seedBadges(payload: Payload): Promise<Map<string, number>> {
	const filePath = path.join(CONTENT_DIR, "badges.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);
	const badgeIds = new Map<string, number>();

	console.log(`Seeding badges (${items.length})...`);

	await mapWithConcurrency(items, SEED_LIMITS.badges, async (item) => {
		if (typeof item.slug !== "string") {
			throw new Error("Badge seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "badges", item);
		badgeIds.set(item.slug, doc.id as number);
		console.log(`  + badge ${item.slug}`);
	});

	return badgeIds;
}

async function seedThemes(
	payload: Payload,
	mediaCache: TMediaCache
): Promise<number> {
	const filePath = path.join(CONTENT_DIR, "themes.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);

	console.log(`Seeding themes (${items.length}, concurrency=${SEED_LIMITS.themes})...`);

	await mapWithConcurrency(items, SEED_LIMITS.themes, async (item) => {
		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: String(item.slug);

		await seedLocalizedDoc(payload, "themes", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveSeedDocument(payload, mediaCache, data, locale)
		});
		console.log(`  + theme ${slug}`);
	});

	return items.length;
}

async function seedCountries(
	payload: Payload,
	lookup: SeedLookupCache,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const countriesDir = path.join(CONTENT_DIR, "countries");
	const files = (await fs.readdir(countriesDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	console.log(
		`Seeding countries (${files.length}, concurrency=${SEED_LIMITS.countries})...`
	);

	await mapWithConcurrency(files, SEED_LIMITS.countries, async (file, index) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(countriesDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const result = await seedLocalizedDoc(payload, "countries", item, {
			published: true,
			beforeCreate: async (data, locale) => {
				const withNavOrder = applyGeoNavOrder(data, index);
				const withBadges = resolveBadgeIds(withNavOrder, badgeIds);
				return resolveSeedDocument(
					payload,
					mediaCache,
					withBadges,
					locale,
					{ deferRouteMapStops: true }
				);
			}
		});

		if (result.createdDoc) {
			registerCountryFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + country ${slug}`);
	});

	return files.length;
}

export async function refreshRouteMapStops(
	_payload: Payload,
	collection: TRouteMapCollection,
	_badgeIds: Map<string, number>,
	_mediaCache: TMediaCache,
	options?: { countrySlug?: string; locales?: readonly TLocale[] }
): Promise<void> {
	const contentDir = path.join(
		CONTENT_DIR,
		ROUTE_MAP_CONTENT_DIRS[collection]
	);
	const files = (await fs.readdir(contentDir)).filter((file) =>
		file.endsWith(".yml")
	);
	const tables = ROUTE_MAP_SQL_TABLES[collection];
	const uri = process.env.DATABASE_URI?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI is not set for routeMap refresh");
	}

	type TRefreshJob = {
		slug: string;
		resolvedStops: Array<{
			entityType: TRouteMapEntityType;
			relationValue: number;
		}>;
	};

	const jobs: TRefreshJob[] = [];

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(contentDir, file)
		);

		if (options?.countrySlug) {
			if (collection === "countries") {
				const slug =
					typeof item.slug === "object" &&
					item.slug !== null &&
					"en" in item.slug
						? String((item.slug as Record<string, unknown>).en)
						: file.replace(/\.yml$/, "");
				if (slug !== options.countrySlug) {
					continue;
				}
			} else if (
				yamlFieldString(item, "country") !== options.countrySlug
			) {
				continue;
			}
		}

		const blocks = item.blocks;

		if (!Array.isArray(blocks)) {
			continue;
		}

		const routeMapBlock = blocks.find(
			(block) =>
				block &&
				typeof block === "object" &&
				(block as Record<string, unknown>).blockType === "routeMap" &&
				Array.isArray((block as Record<string, unknown>).stops)
		) as Record<string, unknown> | undefined;

		if (!routeMapBlock) {
			continue;
		}

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const resolved = (await resolveRouteMapStops(
			routeMapBlock.stops as unknown[]
		)) as Array<Record<string, unknown>>;

		const resolvedStops = resolved
			.map((stop) => {
				const entityType = stop.entityType as
					| TRouteMapEntityType
					| undefined;
				const relation = stop.relation as
					| { value?: number }
					| undefined;

				if (!entityType || typeof relation?.value !== "number") {
					return null;
				}

				return {
					entityType,
					relationValue: relation.value
				};
			})
			.filter(
				(
					stop
				): stop is {
					entityType: TRouteMapEntityType;
					relationValue: number;
				} => stop !== null
			);

		if (resolvedStops.length === 0) {
			continue;
		}

		jobs.push({ slug, resolvedStops });
	}

	const pool = new pg.Pool({
		connectionString: uri,
		max: 4,
		connectionTimeoutMillis: 30_000,
		idleTimeoutMillis: 30_000,
		keepAlive: true
	});

	try {
		await mapPool(jobs, 2, async (job) => {
			const client = await pool.connect();

			try {
				await client.query("BEGIN");

				const docResult = await client.query<{ id: number }>(
					`SELECT _parent_id AS id
					 FROM ${tables.locales}
					 WHERE slug = $1 AND _locale = 'en'
					 LIMIT 1`,
					[job.slug]
				);
				const docId = docResult.rows[0]?.id;

				if (!docId) {
					console.warn(
						`  ! ${collection} not found for routeMap refresh: ${job.slug}`
					);
					await client.query("ROLLBACK");
					return;
				}

				const blocksResult = await client.query<{
					id: string;
					_order: number;
					_locale: string;
				}>(
					`SELECT id, _order, _locale
					 FROM ${tables.routeMap}
					 WHERE _parent_id = $1`,
					[docId]
				);

				if (blocksResult.rows.length === 0) {
					console.warn(
						`  ! ${collection} has no routeMap block: ${job.slug}`
					);
					await client.query("ROLLBACK");
					return;
				}

				await client.query(
					`DELETE FROM ${tables.rels}
					 WHERE parent_id = $1
					   AND path LIKE '%.stops.%.relation'`,
					[docId]
				);

				for (const block of blocksResult.rows) {
					await client.query(
						`DELETE FROM ${tables.stops} WHERE _parent_id = $1`,
						[block.id]
					);

					const blockIndex = Number(block._order) - 1;

					for (
						let stopIndex = 0;
						stopIndex < job.resolvedStops.length;
						stopIndex += 1
					) {
						const stop = job.resolvedStops[stopIndex];
						const stopId = randomBytes(12).toString("hex");
						const relColumn = ENTITY_REL_COLUMN[stop.entityType];
						const pathValue = `blocks.${blockIndex}.stops.${stopIndex}.relation`;

						await client.query(
							`INSERT INTO ${tables.stops}
								(_order, _parent_id, _locale, id, entity_type)
							 VALUES ($1, $2, $3, $4, $5)`,
							[
								stopIndex + 1,
								block.id,
								block._locale,
								stopId,
								stop.entityType
							]
						);

						await client.query(
							`INSERT INTO ${tables.rels}
								(parent_id, path, locale, ${relColumn})
							 VALUES ($1, $2, $3, $4)`,
							[docId, pathValue, block._locale, stop.relationValue]
						);
					}
				}

				await client.query("COMMIT");
				console.log(`  ~ ${collection} routeMap stops ${job.slug}`);
			} catch (error) {
				await client.query("ROLLBACK");
				console.warn(
					`  ! ${collection} routeMap refresh skipped ${job.slug}: ${
						error instanceof Error ? error.message : String(error)
					}`
				);
			} finally {
				client.release();
			}
		});
	} finally {
		await pool.end();
	}
}

async function seedRegions(
	payload: Payload,
	lookup: SeedLookupCache,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const regionsDir = path.join(CONTENT_DIR, "regions");

	let files: string[];

	try {
		files = (await fs.readdir(regionsDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding regions (0)...");

		return 0;
	}

	console.log(
		`Seeding regions (${files.length}, concurrency=${SEED_LIMITS.regions})...`
	);

	await mapWithConcurrency(files, SEED_LIMITS.regions, async (file, index) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(regionsDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const result = await seedLocalizedDoc(payload, "regions", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveRegionSeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerRegionFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + region ${slug}`);
	});

	return files.length;
}

async function seedCities(
	payload: Payload,
	lookup: SeedLookupCache,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const citiesDir = path.join(CONTENT_DIR, "cities");

	let files: string[];

	try {
		files = (await fs.readdir(citiesDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding cities (0)...");

		return 0;
	}

	console.log(
		`Seeding cities (${files.length}, concurrency=${SEED_LIMITS.cities})...`
	);

	await mapWithConcurrency(files, SEED_LIMITS.cities, async (file, index) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(citiesDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const result = await seedLocalizedDoc(payload, "cities", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveCitySeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerCityFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + city ${slug}`);
	});

	return files.length;
}

async function seedAttractions(
	payload: Payload,
	lookup: SeedLookupCache,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const attractionsDir = path.join(CONTENT_DIR, "attractions");

	let files: string[];

	try {
		files = (await fs.readdir(attractionsDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding attractions (0)...");

		return 0;
	}

	console.log(
		`Seeding attractions (${files.length}, concurrency=${SEED_LIMITS.attractions})...`
	);

	await mapWithConcurrency(files, SEED_LIMITS.attractions, async (file) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(attractionsDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const result = await seedLocalizedDoc(payload, "attractions", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveAttractionSeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerAttractionFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + attraction ${slug}`);
	});

	return files.length;
}

async function findSegmentIdBySlug(segmentSlug: string): Promise<number> {
	return activeLookup.getSegmentId(segmentSlug);
}

async function resolvePageSeedData(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>,
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.segment === "string") {
		result.segment = await findSegmentIdBySlug(result.segment);
	}

	return resolveSeedDocument(payload, mediaCache, result, locale, options);
}

export async function seedSegments(payload: Payload): Promise<Map<string, number>> {
	const filePath = path.join(CONTENT_DIR, "segments.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);

	console.log(`Seeding segments (${items.length})...`);

	const segmentIds = new Map<string, number>();

	for (const item of items) {
		if (typeof item.slug !== "string") {
			throw new Error("Segment seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "segments", item, {
			published: true
		});

		segmentIds.set(item.slug, doc.id as number);
		console.log(`  + segment ${item.slug}`);
	}

	return segmentIds;
}

export async function seedPages(
	payload: Payload,
	mediaCache: TMediaCache,
	options?: TResolvePageOptions
): Promise<{ count: number; pageIds: Map<string, number> }> {
	const pagesDir = path.join(CONTENT_DIR, "pages");
	const files = (await fs.readdir(pagesDir))
		.filter((file) => file.endsWith(".yml"))
		.filter((file) => options?.fileFilter?.(file) ?? true)
		.sort();

	if (files.length === 0) {
		throw new Error("No page YAML files matched the seed filter");
	}

	console.log(`Seeding pages (${files.length})...`);

	const pageIds = new Map<string, number>();

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(pagesDir, file)
		);

		if (
			item.pathGroup != null &&
			item.pathGroup !== "" &&
			!isPagePathGroup(item.pathGroup)
		) {
			throw new Error(
				`Invalid pathGroup "${String(item.pathGroup)}" in ${file}`
			);
		}

		const result = await seedLocalizedDoc(payload, "pages", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolvePageSeedData(payload, mediaCache, data, locale, options)
		});

		const segmentSlug =
			typeof item.segment === "string" ? item.segment : undefined;
		const pathGroup =
			typeof item.pathGroup === "string" ? item.pathGroup : undefined;
		const pageSlug = resolveSeedSlug(item);

		if (segmentSlug && pageSlug) {
			const key = pathGroup
				? `${segmentSlug}/${pathGroup}/${pageSlug}`
				: `${segmentSlug}/${pageSlug}`;
			pageIds.set(key, result.id as number);
		}

		console.log(`  + page ${file.replace(/\.yml$/, "")}`);
	}

	return { count: files.length, pageIds };
}

type TNavigationSeedContext = {
	segmentIds: Map<string, number>;
	pageIds: Map<string, number>;
	destinationSlug: string;
};

export async function buildNavigationContextFromDb(
	payload: Payload
): Promise<TNavigationSeedContext> {
	const [segmentsResult, pagesResult, destination] = await Promise.all([
		payload.find({
			collection: "segments",
			limit: 500,
			depth: 0,
			pagination: false,
			overrideAccess: true
		}),
		payload.find({
			collection: "pages",
			limit: 1000,
			depth: 1,
			pagination: false,
			overrideAccess: true
		}),
		payload.findGlobal({
			slug: "destination",
			depth: 0,
			overrideAccess: true
		})
	]);

	const segmentIds = new Map<string, number>();

	for (const segment of segmentsResult.docs) {
		if (typeof segment.slug === "string") {
			segmentIds.set(segment.slug, segment.id as number);
		}
	}

	const pageIds = new Map<string, number>();

	for (const page of pagesResult.docs) {
		const segment =
			page.segment && typeof page.segment === "object"
				? page.segment
				: null;
		const segmentSlug =
			segment && typeof segment.slug === "string" ? segment.slug : null;
		const pageSlug = typeof page.slug === "string" ? page.slug : null;

		if (!segmentSlug || !pageSlug) {
			continue;
		}

		const pathGroup =
			typeof page.pathGroup === "string" && page.pathGroup.length > 0
				? page.pathGroup
				: undefined;
		const key = pathGroup
			? `${segmentSlug}/${pathGroup}/${pageSlug}`
			: `${segmentSlug}/${pageSlug}`;

		pageIds.set(key, page.id as number);
	}

	const destinationSlug =
		typeof destination?.slug === "string" && destination.slug.length > 0
			? destination.slug
			: "central-asia";

	return { segmentIds, pageIds, destinationSlug };
}

function resolveNavHref(
	href: unknown,
	context: TNavigationSeedContext
): unknown {
	if (typeof href !== "string") {
		return href;
	}

	if (href === "__DESTINATION_SLUG__") {
		return `/${context.destinationSlug}`;
	}

	return href;
}

async function resolveNavigationItem(
	item: Record<string, unknown>,
	context: TNavigationSeedContext
): Promise<Record<string, unknown>> {
	assertNoDeprecatedNavigationOrder(item, "navigation item");

	const result = { ...item };

	if (result.type === "group" && Array.isArray(result.groupItems)) {
		result.groupItems = await resolveNavItemsArray(
			result.groupItems as unknown[],
			context
		);
	}

	if (result.type === "page" && typeof result.page === "string") {
		const id = context.pageIds.get(result.page);

		if (!id) {
			throw new Error(`Page not found for nav item: ${result.page}`);
		}

		result.page = id;
	}

	if (typeof result.href === "string") {
		result.href = resolveNavHref(result.href, context);
	}

	return result;
}

async function resolveNavItemsArray(
	items: unknown[] | undefined,
	context: TNavigationSeedContext
): Promise<Record<string, unknown>[]> {
	if (!items?.length) {
		return [];
	}

	assertNoDeprecatedNavigationOrderInItems(items, "navigation items");

	return Promise.all(
		items.map(async (item) => {
			if (!item || typeof item !== "object") {
				return item as Record<string, unknown>;
			}

			return resolveNavigationItem(item as Record<string, unknown>, context);
		})
	);
}

async function resolveFooterColumns(
	columns: unknown[] | undefined,
	context: TNavigationSeedContext
): Promise<Record<string, unknown>[]> {
	if (!columns?.length) {
		return [];
	}

	return Promise.all(
		columns.map(async (column) => {
			if (!column || typeof column !== "object") {
				return column as Record<string, unknown>;
			}

			const entry = column as Record<string, unknown>;

			return {
				...entry,
				items: await resolveNavItemsArray(
					entry.items as unknown[] | undefined,
					context
				)
			};
		})
	);
}

export async function seedNavigation(
	payload: Payload,
	mediaCache: TMediaCache,
	context: TNavigationSeedContext
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "navigation.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	const headerRaw = raw.header as Record<string, unknown> | undefined;

	if (headerRaw) {
		console.log("Seeding header global...");

		const enLocalized = pickLocale(headerRaw, "en") as Record<string, unknown>;
		const enNavItems = await resolveNavItemsArray(
			enLocalized.navItems as unknown[] | undefined,
			context
		);
		const enData: Record<string, unknown> = {
			...enLocalized,
			navItems: enNavItems
		};

		if (typeof enData.logo === "string") {
			enData.logo = (await ensureMedia(payload, mediaCache, enData.logo)).id;
		}

		await payload.updateGlobal({
			slug: "header",
			data: enData,
			locale: "en",
			...SEED_OP_OPTS
		});

		console.log("  + header locale en");

		const headerWithIds = await payload.findGlobal({
			slug: "header",
			locale: "en",
			depth: 0,
			...SEED_OP_OPTS
		});

		const headerLocales = resolveLocalesWithContent(
			headerRaw,
			resolveSeedLocales()
		).filter((locale) => locale !== "en");

		for (const locale of headerLocales) {
			const localized = pickLocale(headerRaw, locale) as Record<
				string,
				unknown
			>;
			const navItems = await resolveNavItemsArray(
				localized.navItems as unknown[] | undefined,
				context
			);
			const mergedNavItems = mergeNavItemsById(
				headerWithIds?.navItems as Record<string, unknown>[] | undefined,
				navItems
			);
			const localizedAreas = (localized.informationAreas as
				| Record<string, unknown>[]
				| undefined) ?? [];
			const mergedAreas = mergeInformationAreasById(
				headerWithIds?.informationAreas as
					| Record<string, unknown>[]
					| undefined,
				localizedAreas
			);
			const mergedUserMenuItems = mergeNavItemsById(
				headerWithIds?.userMenuItems as
					| Record<string, unknown>[]
					| undefined,
				(pickLocale(localized.userMenuItems, locale) as
					| Record<string, unknown>[]
					| undefined) ?? []
			);

			await payload.updateGlobal({
				slug: "header",
				data: {
					navItems: mergedNavItems as Header["navItems"],
					informationAreas:
						mergedAreas as Header["informationAreas"],
					userMenuItems:
						mergedUserMenuItems as Header["userMenuItems"],
					ctaAction: localized.ctaAction as Header["ctaAction"]
				},
				locale,
				...SEED_OP_OPTS
			});

			console.log(`  + header locale ${locale}`);
		}
	}

	const footerRaw = raw.footer as Record<string, unknown> | undefined;

	if (footerRaw) {
		console.log("Seeding footer global...");

		const enLocalized = pickLocale(footerRaw, "en") as Record<string, unknown>;
		const enColumns = await resolveFooterColumns(
			enLocalized.columns as unknown[] | undefined,
			context
		);

		await payload.updateGlobal({
			slug: "footer",
			data: {
				...enLocalized,
				columns: enColumns
			},
			locale: "en",
			...SEED_OP_OPTS
		});

		console.log("  + footer locale en");

		const footerWithIds = await payload.findGlobal({
			slug: "footer",
			locale: "en",
			depth: 0,
			...SEED_OP_OPTS
		});

		const footerLocales = resolveLocalesWithContent(
			footerRaw,
			resolveSeedLocales()
		).filter((locale) => locale !== "en");

		for (const locale of footerLocales) {
			const localized = pickLocale(footerRaw, locale) as Record<
				string,
				unknown
			>;
			const columns = await resolveFooterColumns(
				localized.columns as unknown[] | undefined,
				context
			);
			const mergedColumns = mergeFooterColumnsById(
				footerWithIds?.columns as Record<string, unknown>[] | undefined,
				columns
			);

			await payload.updateGlobal({
				slug: "footer",
				data: {
					columns: mergedColumns as Footer["columns"],
					copyrightText: localized.copyrightText as Footer["copyrightText"]
				},
				locale,
				...SEED_OP_OPTS
			});

			console.log(`  + footer locale ${locale}`);
		}
	}

	await assertNavigationLabelsSeeded(payload, headerRaw);
}

async function assertNavigationLabelsSeeded(
	payload: Payload,
	headerRaw?: Record<string, unknown>
): Promise<void> {
	if (!headerRaw) {
		return;
	}

	for (const locale of LOCALES) {
		if (headerRaw && !rawHasLocaleContent(headerRaw, locale)) {
			continue;
		}

		const header = await payload.findGlobal({
			slug: "header",
			locale,
			depth: 0,
			...SEED_OP_OPTS
		});

		const labels =
			header?.navItems?.map((item) => item.label?.trim()).filter(Boolean) ?? [];

		if (labels.length === 0) {
			throw new Error(
				`Header nav labels were not saved for locale "${locale}"`
			);
		}
	}
}

async function main(): Promise<void> {
	if (!process.env.PAYLOAD_SECRET) {
		throw new Error("PAYLOAD_SECRET is not set");
	}

	await acquireSeedLock();

	try {
		await runSeed();
	} finally {
		await releaseSeedLock();
	}
}

async function runSeed(): Promise<void> {
	const fullReset = isSeedFullReset();
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const cost = createSeedCostTracker(profiler);
	const log = createSeedStageLogger(SEED_STAGE_COUNT);
	const lookup = new SeedLookupCache();

	logSeedConnectionInfo(seedDbUri);
	logSeedResetMode();
	logSeedPerformanceSettings();
	console.log(
		"Baseline: run a single seed process (stop dev server). Profile summary prints at end."
	);
	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.DATABASE_URI = seedDbUri;

	if (fullReset) {
		// Empty DB after DROP SCHEMA — drizzle push must recreate tables.
		process.env.PAYLOAD_DB_PUSH = "true";
	} else {
		process.env.PAYLOAD_DB_PUSH = "false";
	}

	const { default: config } = await import("@payload-config");

	const skipReset = shouldSkipDatabaseReset();
	isCleanMediaRun = !skipReset && !(
		!fullReset && shouldPreserveMediaOnFastReset()
	);

	if (skipReset) {
		console.log(
			"Skipping database reset (SEED_RESUME / SEED_SKIP_RESET) — keep existing rows"
		);
		clearCaches();
	} else {
		log.start(fullReset ? "Reset database (full)" : "Reset database (fast)");
		await resetDatabase(seedDbUri, fullReset);
		log.done();

		const preserveMedia = !fullReset && shouldPreserveMediaOnFastReset();

		if (preserveMedia) {
			console.log(
				"Skipping media upload directory reset (preserving media records)"
			);
			clearCaches();
		} else {
			log.start("Reset media upload directory");
			await resetMediaFolderContents();
			clearCaches();
			log.done();
		}
	}

	log.start("Initializing Payload");
	logPayloadInitContext();
	const payload = await profiler.run("payload_init", () =>
		retrySeedOperation(async (attempt) => {
			if (attempt > 1 && !skipReset) {
				markSeedRetry();
				console.warn(
					"  ! re-running database reset before Payload retry..."
				);
				await resetDatabase(seedDbUri, fullReset);
			}

			await wakeDatabase(seedDbUri);

			return waitWithHeartbeat(
				getPayload({ config }),
				fullReset && !skipReset
					? "drizzle schema push after schema pull (DDL, no console output from drizzle-kit)"
					: "Payload init (schema push skipped if unchanged)"
			);
		}, "Payload initialization")
	);
	profiler.attachSqlCounter(payload);
	attachSeedPoolErrorHandler(payload);
	log.done();

	cost.markSeedPhaseStart();

	let mediaDbIndex: TMediaDbIndex | undefined;

	if (!fullReset || skipReset) {
		console.log("Preloading media DB index...");
		mediaDbIndex = await preloadMediaDbIndex(payload);
	}

	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);

	const mediaCache: TMediaCache = new Map();

	log.start("Seeding badges");
	const badgeIds = await seedBadges(payload);
	log.done();

	log.start("Seeding themes");
	const themesCount = await seedThemes(payload, mediaCache);
	await lookup.ingestThemes(payload);
	log.done();

	log.start("Seeding countries");
	const countriesCount = await seedCountries(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding regions");
	const regionsCount = await seedRegions(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding cities");
	const citiesCount = await seedCities(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding attractions");
	const attractionsCount = await seedAttractions(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	const discoverySeeder = createDiscoverySeeder({
		contentDir: CONTENT_DIR,
		readYamlFile,
		seedLocalizedDoc,
		resolveSeedDocument,
		resolveBadgeIds,
		pickLocale,
		updateGlobal: seedDiscoveryGlobal
	});

	log.start("Seeding experiences");
	const experiencesCount = await discoverySeeder.seedExperiences(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding routes");
	const routesCount = await discoverySeeder.seedRoutes(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding map points");
	const mapPointsCount = await discoverySeeder.seedMapPoints(payload, lookup);
	log.done();

	log.start("Seeding routes hub");
	await discoverySeeder.seedRoutesHub(payload, mediaCache);
	log.done();

	log.start("Seeding experiences hub");
	await discoverySeeder.seedExperiencesHub(payload, mediaCache);
	log.done();

	log.start("Seeding trade fairs");
	const tradeFairsCount = await discoverySeeder.seedTradeFairs(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding trade fairs hub");
	await discoverySeeder.seedTradeFairsHub(payload, mediaCache);
	log.done();

	log.start("Seeding blog");
	const blogCount = await discoverySeeder.seedBlog(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding blog hub");
	await discoverySeeder.seedBlogHub(payload, mediaCache);
	log.done();

	log.start("Seeding news");
	const newsCount = await discoverySeeder.seedNews(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding news hub");
	await discoverySeeder.seedNewsHub(payload, mediaCache);
	log.done();

	log.start("Refreshing route map stops");
	// Resume / skip-existing path never calls register*FromDoc — rebuild lookup from DB.
	await profiler.run("lookup_ingest", async () => {
		await lookup.ingestCountries(payload);
		await lookup.ingestRegions(payload);
		await lookup.ingestCities(payload);
		await lookup.ingestAttractions(payload);
	});
	await profiler.run("route_refresh", async () => {
		await refreshRouteMapStops(payload, "attractions", badgeIds, mediaCache);
		await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache);
		await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache);
		await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache);
	});
	log.done();

	log.start("Seeding destination");
	const navigationRootSlug = await profiler.run("navigation_globals", () =>
		seedDestination(payload, mediaCache)
	);
	log.done();

	log.start("Seeding homepage");
	await profiler.run("navigation_globals", () =>
		seedHomepage(payload, mediaCache, navigationRootSlug)
	);
	log.done();

	log.start("Seeding tours page");
	await profiler.run("navigation_globals", () => seedToursPage(payload));
	log.done();

	log.start("Seeding segments");
	const segmentIds = await seedSegments(payload);
	lookup.ingestSegments(segmentIds);
	log.done();

	log.start("Seeding pages");
	const { count: pagesCount, pageIds } = await seedPages(
		payload,
		mediaCache,
		{ hrefPrefix: navigationRootSlug }
	);
	log.done();

	log.start("Seeding navigation");
	await profiler.run("navigation_globals", () =>
		seedNavigation(payload, mediaCache, {
			segmentIds,
			pageIds,
			destinationSlug: navigationRootSlug
		})
	);
	log.done();

	log.start("Seeding UI content");
	await profiler.run("ui_content_globals", () => seedUiContent(payload));
	log.done();

	console.log("Seed complete:", {
		badges: badgeIds.size,
		themes: themesCount,
		countries: countriesCount,
		regions: regionsCount,
		cities: citiesCount,
		attractions: attractionsCount,
		experiences: experiencesCount,
		routes: routesCount,
		tradeFairs: tradeFairsCount,
		blog: blogCount,
		news: newsCount,
		mapPoints: mapPointsCount,
		routesHub: true,
		experiencesHub: true,
		tradeFairsHub: true,
		blogHub: true,
		newsHub: true,
		homepage: true,
		tours: true,
		destination: true,
		segments: segmentIds.size,
		pages: pagesCount,
		header: true,
		footer: true
	});

	cost.logSummary(fullReset ? "full" : "fast");
	process.exit(0);
}

const isSeedEntrypoint =
	process.argv[1] &&
	path.resolve(fileURLToPath(import.meta.url)) ===
		path.resolve(process.argv[1]);

function getSeedOnlyTarget(): string | null {
	const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));

	if (!onlyArg) {
		return null;
	}

	return onlyArg.slice("--only=".length).trim() || null;
}

async function runSeedNavigationOnly(): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();

	logSeedConnectionInfo(seedDbUri);
	console.log("Seed mode: navigation only (no DB reset)");

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);

	const mediaCache: TMediaCache = new Map();
	const context = await buildNavigationContextFromDb(payload);

	console.log(
		`Navigation context: ${context.segmentIds.size} segments, ${context.pageIds.size} pages, destination=${context.destinationSlug}`
	);

	await seedNavigation(payload, mediaCache, context);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Navigation seed complete");
	process.exit(0);
}

async function runSeedCompanyPagesOnly(pageSlug?: string): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();
	const pageFiles = pageSlug
		? pageSlug
				.split(",")
				.map((slug) => `${slug.trim().replace(/\.yml$/, "")}.yml`)
				.filter(Boolean)
		: [];

	logSeedConnectionInfo(seedDbUri);
	console.log(
		pageFiles.length > 0
			? `Seed mode: page only (${pageFiles.join(", ")}, no DB reset, upsert by slug)`
			: "Seed mode: company pages only (about + team, no DB reset, upsert by slug)"
	);

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;
	process.env.SEED_RESUME = "false";
	process.env.SEED_SKIP_EXISTING = "false";
	process.env.SEED_SKIP_RESET = "true";

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);
	await lookup.ingestSegmentsFromDb(payload);
	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);

	const mediaCache: TMediaCache = new Map();
	const pageFileSet = new Set(pageFiles);
	const hrefPrefix = await readDestinationSlugFromDb(payload);
	const { count } = await seedPages(payload, mediaCache, {
		hrefPrefix,
		fileFilter:
			pageFileSet.size > 0
				? (file) => pageFileSet.has(file)
				: isCompanyPageSeedFile
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log(`Company pages seed complete (${count})`);
	process.exit(0);
}

async function loadBadgeIdsFromDb(
	payload: Payload
): Promise<Map<string, number>> {
	const result = await payload.find({
		collection: "badges",
		locale: "en",
		limit: 100,
		depth: 0,
		overrideAccess: true
	});
	const badgeIds = new Map<string, number>();

	for (const doc of result.docs) {
		if (typeof doc.slug === "string") {
			badgeIds.set(doc.slug, doc.id as number);
		}
	}

	return badgeIds;
}

async function runSeedCityOnly(citySlug: string): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();

	logSeedConnectionInfo(seedDbUri);
	console.log(`Seed mode: city only (${citySlug}, no DB reset)`);

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);

	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);

	const mediaCache: TMediaCache = new Map();
	const badgeIds = await loadBadgeIdsFromDb(payload);

	const cityPath = path.join(CONTENT_DIR, "cities", `${citySlug}.yml`);
	const cityItem = await readYamlFile<Record<string, unknown>>(cityPath);

	console.log(`Updating city ${citySlug}...`);
	const cityResult = await seedLocalizedDocOnce(payload, "cities", cityItem, {
		published: true,
		skipSlugLookup: false,
		beforeCreate: async (data, locale) =>
			resolveCitySeedData(payload, data, locale, badgeIds, mediaCache)
	});

	if (cityResult.createdDoc) {
		registerCityFromDoc(lookup, cityResult.createdDoc);
	}

	const attractionsDir = path.join(CONTENT_DIR, "attractions");
	const attractionFiles = (await fs.readdir(attractionsDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	let attractionCount = 0;

	for (const file of attractionFiles) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(attractionsDir, file)
		);
		const cityRef =
			typeof item.city === "string"
				? item.city
				: item.city &&
					  typeof item.city === "object" &&
					  "en" in (item.city as object)
					? String((item.city as Record<string, unknown>).en)
					: null;

		if (cityRef !== citySlug) {
			continue;
		}

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		await seedLocalizedDocOnce(payload, "attractions", item, {
			published: true,
			skipSlugLookup: false,
			beforeCreate: async (data, locale) =>
				resolveAttractionSeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});
		console.log(`  + attraction ${slug}`);
		attractionCount++;
	}

	console.log(`Refreshing routeMap stops for city ${citySlug}...`);
	for (const locale of LOCALES) {
		if (!rawHasLocaleContent(cityItem, locale)) {
			continue;
		}

		const localeData = await resolveSeedDocument(
			payload,
			mediaCache,
			resolveBadgeIds(
				pickLocale(cityItem, locale) as Record<string, unknown>,
				badgeIds
			),
			locale
		);

		const existing = await findSeedDocBySlug(payload, "cities", citySlug);

		if (!existing) {
			throw new Error(`City not found after seed: ${citySlug}`);
		}

		await payload.update({
			collection: "cities",
			id: existing.id,
			data: {
				blocks: (localeData as Record<string, unknown>).blocks
			},
			locale,
			...SEED_OP_OPTS
		});
	}

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log(
		`City seed complete: ${citySlug} (+ ${attractionCount} attractions)`
	);
	process.exit(0);
}

function yamlFieldString(
	item: Record<string, unknown>,
	key: string
): string | null {
	const value = item[key];

	if (typeof value === "string") {
		return value;
	}

	if (value && typeof value === "object" && "en" in value) {
		return String((value as Record<string, unknown>).en);
	}

	return null;
}

function yamlSlug(item: Record<string, unknown>, file: string): string {
	const fromField = yamlFieldString(item, "slug");

	return fromField || file.replace(/\.yml$/, "");
}

/**
 * Upsert regions + cities + attractions for one country.
 * Does not reset DB and does not create/update the country document.
 * Usage: --only=destinations:<countrySlug>
 */
async function runSeedCountryDestinationsOnly(
	countrySlug: string
): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();

	if (!countrySlug) {
		throw new Error("Missing country slug for destinations seed");
	}

	logSeedConnectionInfo(seedDbUri);
	console.log(
		`Seed mode: destinations only for country=${countrySlug} (regions+cities+attractions, no country doc, no DB reset)`
	);

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);

	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);

	const mediaCache: TMediaCache = new Map();
	const badgeIds = await loadBadgeIdsFromDb(payload);

	const belongsToCountry = (item: Record<string, unknown>): boolean =>
		yamlFieldString(item, "country") === countrySlug;

	const regionsDir = path.join(CONTENT_DIR, "regions");
	const regionFiles = (await fs.readdir(regionsDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	let regionCount = 0;

	console.log(`Updating regions for ${countrySlug}...`);
	for (const [index, file] of regionFiles.entries()) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(regionsDir, file)
		);

		if (!belongsToCountry(item)) {
			continue;
		}

		const slug = yamlSlug(item, file);
		const result = await seedLocalizedDocOnce(payload, "regions", item, {
			published: true,
			skipSlugLookup: false,
			beforeCreate: async (data, locale) =>
				resolveRegionSeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerRegionFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + region ${slug}`);
		regionCount++;
	}

	await lookup.ingestRegions(payload);

	const citiesDir = path.join(CONTENT_DIR, "cities");
	const cityFiles = (await fs.readdir(citiesDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	let cityCount = 0;

	console.log(`Updating cities for ${countrySlug}...`);
	for (const [index, file] of cityFiles.entries()) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(citiesDir, file)
		);

		if (!belongsToCountry(item)) {
			continue;
		}

		const slug = yamlSlug(item, file);
		const result = await seedLocalizedDocOnce(payload, "cities", item, {
			published: true,
			skipSlugLookup: false,
			beforeCreate: async (data, locale) =>
				resolveCitySeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerCityFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + city ${slug}`);
		cityCount++;
	}

	await lookup.ingestCities(payload);

	const attractionsDir = path.join(CONTENT_DIR, "attractions");
	const attractionFiles = (await fs.readdir(attractionsDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	let attractionCount = 0;

	console.log(`Updating attractions for ${countrySlug}...`);
	for (const file of attractionFiles) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(attractionsDir, file)
		);

		if (!belongsToCountry(item)) {
			continue;
		}

		const slug = yamlSlug(item, file);
		await seedLocalizedDocOnce(payload, "attractions", item, {
			published: true,
			skipSlugLookup: false,
			beforeCreate: async (data, locale) =>
				resolveAttractionSeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});
		console.log(`  + attraction ${slug}`);
		attractionCount++;
	}

	await lookup.ingestAttractions(payload);

	console.log(
		`Refreshing routeMap stops (cities + regions + country) for ${countrySlug}...`
	);
	await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache, {
		countrySlug
	});
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		countrySlug
	});
	await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache, {
		countrySlug
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log(
		`Destinations seed complete (${countrySlug}): regions=${regionCount}, cities=${cityCount}, attractions=${attractionCount}`
	);
	process.exit(0);
}

/**
 * Upsert a single country document (no DB reset, no child entities).
 * Usage: --only=country:<countrySlug>
 */
async function runSeedCountryOnly(countrySlug: string): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();

	if (!countrySlug) {
		throw new Error("Missing country slug");
	}

	logSeedConnectionInfo(seedDbUri);
	console.log(
		`Seed mode: country only (${countrySlug}, no DB reset, no destinations)`
	);

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);

	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);

	const mediaCache: TMediaCache = new Map();
	const badgeIds = await loadBadgeIdsFromDb(payload);

	const countryPath = path.join(
		CONTENT_DIR,
		"countries",
		`${countrySlug}.yml`
	);
	const countryItem = await readYamlFile<Record<string, unknown>>(countryPath);

	console.log(`Updating country ${countrySlug}...`);
	const result = await seedLocalizedDocOnce(
		payload,
		"countries",
		countryItem,
		{
			published: true,
			skipSlugLookup: false,
			beforeCreate: async (data, locale) => {
				const withBadges = resolveBadgeIds(data, badgeIds);
				return resolveSeedDocument(
					payload,
					mediaCache,
					withBadges,
					locale,
					{ deferRouteMapStops: true }
				);
			}
		}
	);

	if (result.createdDoc) {
		registerCountryFromDoc(lookup, result.createdDoc);
	}

	console.log(`Refreshing routeMap stops for country ${countrySlug}...`);
	await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache, {
		countrySlug
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log(`Country seed complete: ${countrySlug}`);
	process.exit(0);
}

async function runSeedToursOnly(): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();

	logSeedConnectionInfo(seedDbUri);
	console.log("Seed mode: tours page only (catalog.yml, no DB reset)");

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	await seedToursPage(payload);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Tours page seed complete");
	process.exit(0);
}

async function runSeedHomepageDestinationOnly(): Promise<void> {
	const seedDbUri = resolveSeedDatabaseUri();
	const profiler = createSeedProfiler();
	const lookup = new SeedLookupCache();

	logSeedConnectionInfo(seedDbUri);
	console.log(
		"Seed mode: homepage + destination hub (no DB reset)"
	);

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;
	process.env.SEED_RESUME = "false";
	process.env.SEED_SKIP_EXISTING = "false";
	process.env.SEED_SKIP_RESET = "true";

	const { default: config } = await import("@payload-config");
	await wakeDatabase(seedDbUri);
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex, profiler);
	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);
	await lookup.ingestRoutes(payload);
	await lookup.ingestExperiences(payload);
	await lookup.ingestTradeFairs(payload);
	await lookup.ingestBlog(payload);
	await lookup.ingestNews(payload);

	const mediaCache: TMediaCache = new Map();
	const hrefPrefix = await readDestinationSlugFromDb(payload);

	await seedHomepage(payload, mediaCache, hrefPrefix);
	await seedDestination(payload, mediaCache);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Homepage and destination hub seed complete");
	process.exit(0);
}

if (isSeedEntrypoint) {
	const only = getSeedOnlyTarget();
	const destinationsMatch = only?.match(/^destinations:(.+)$/);
	const countryMatch = only?.match(/^country:(.+)$/);
	const pageMatch = only?.match(/^page:(.+)$/);

	if (
		only &&
		only !== "navigation" &&
		only !== "company" &&
		only !== "tours" &&
		only !== "homepage" &&
		!only.startsWith("city:") &&
		!destinationsMatch &&
		!countryMatch &&
		!pageMatch
	) {
		console.error(
			`Unknown --only target "${only}". Supported: navigation, company, tours, homepage, page:<yml-basename>, city:<slug>, country:<slug>, destinations:<countrySlug>`
		);
		process.exit(1);
	}

	const run = !only
		? main
		: only === "navigation"
			? runSeedNavigationOnly
			: only === "company"
				? () => runSeedCompanyPagesOnly()
				: only === "tours"
					? runSeedToursOnly
					: only === "homepage"
						? runSeedHomepageDestinationOnly
						: pageMatch
						? () => runSeedCompanyPagesOnly(pageMatch[1].trim())
						: destinationsMatch
							? () =>
									runSeedCountryDestinationsOnly(
										destinationsMatch[1].trim()
									)
							: countryMatch
								? () => runSeedCountryOnly(countryMatch[1].trim())
								: () =>
										runSeedCityOnly(
											only!.slice("city:".length).trim()
										);

	run().catch((error: unknown) => {
		console.error("Seed failed:", error);
		process.exit(1);
	});
}
