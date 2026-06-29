import type { CollectionConfig } from "payload";

import { Attractions } from "./attractions";
import { Badges } from "./badges";
import { Cities } from "./cities";
import { Countries } from "./countries";
import { Experiences } from "./experiences";
import { JournalEntries } from "./journal-entries";
import { MapPoints } from "./map-points";
import { Media } from "./media";
import { Pages } from "./pages";
import { Regions } from "./regions";
import { Routes } from "./routes";
import { Segments } from "./segments";
import { Themes } from "./themes";
import { TradeFairs } from "./trade-fairs";
import { Users } from "./users";

export const collections: CollectionConfig[] = [
	Media,
	Users,
	Badges,
	Themes,
	Countries,
	Regions,
	Cities,
	Attractions,
	Routes,
	MapPoints,
	Experiences,
	JournalEntries,
	TradeFairs,
	Segments,
	Pages
];
