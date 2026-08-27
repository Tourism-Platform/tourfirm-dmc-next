function parseSeedConcurrency(
	envKey: string,
	fallback: number,
	max = 8
): number {
	const value = Number(process.env[envKey] ?? fallback);

	if (!Number.isFinite(value) || value < 1) {
		return fallback;
	}

	return Math.min(Math.floor(value), max);
}

export const SEED_LIMITS = {
	badges: parseSeedConcurrency("SEED_PARALLEL_BADGES", 2),
	themes: parseSeedConcurrency("SEED_PARALLEL_THEMES", 1),
	countries: parseSeedConcurrency("SEED_PARALLEL_COUNTRIES", 1),
	regions: parseSeedConcurrency("SEED_PARALLEL_REGIONS", 1),
	cities: parseSeedConcurrency("SEED_PARALLEL_CITIES", 1),
	attractions: parseSeedConcurrency("SEED_PARALLEL_ATTRACTIONS", 1)
} as const;

export async function mapWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
	if (items.length === 0) {
		return [];
	}

	const results = new Array<R>(items.length);
	let nextIndex = 0;

	const workerCount = Math.min(concurrency, items.length);

	await Promise.all(
		Array.from({ length: workerCount }, async () => {
			while (true) {
				const index = nextIndex;
				nextIndex += 1;

				if (index >= items.length) {
					return;
				}

				results[index] = await mapper(items[index], index);
			}
		})
	);

	return results;
}
