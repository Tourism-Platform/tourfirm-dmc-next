import type { Block } from "payload";

import { Cta } from "./cta";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { Itinerary } from "./itinerary";
import { MostPopularTours } from "./most-popular-tours";
import { OverviewStats } from "./overview-stats";
import { Regular } from "./regular";
import { RouteLine } from "./route-line";
import { RouteMap } from "./route-map";
import { SpecialOffers } from "./special-offers";
import { Timeline } from "./timeline";

export const pageBlocks: Block[] = [
	Hero,
	OverviewStats,
	Regular,
	RouteMap,
	Faq,
	Timeline,
	Itinerary,
	RouteLine,
	Cta
];

export const catalogBlocks: Block[] = [
	Regular,
	MostPopularTours,
	SpecialOffers,
	Cta
];
