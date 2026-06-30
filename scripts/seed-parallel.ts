export const SEED_LIMITS = {
	badges: Number(process.env.SEED_PARALLEL_BADGES ?? 2),
	themes: 1,
	countries: 1,
	regions: 1,
	cities: 1,
	attractions: 1
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
