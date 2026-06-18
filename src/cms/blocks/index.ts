import type { Block } from "payload";

import { Cta } from "./cta";
import { Hero } from "./hero";
import { OverviewStats } from "./overview-stats";
import { Regular } from "./regular";
import { RouteMap } from "./route-map";

export const pageBlocks: Block[] = [
	Hero,
	OverviewStats,
	Regular,
	RouteMap,
	Cta
];
