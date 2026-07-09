import type { TNeonSeedItem } from "./loader.js";
import { seedMilestone1Item, type TMilestone1Context } from "./milestone1.js";
import { isMilestone2Stage, seedMilestone2Item } from "./milestone2.js";

export async function seedNeonItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	if (isMilestone2Stage(item.stage)) {
		await seedMilestone2Item(ctx, item);
		return;
	}

	await seedMilestone1Item(ctx, item);
}
