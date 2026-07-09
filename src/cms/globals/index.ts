import type { GlobalConfig } from "payload";

import { ADMIN_ALL_GLOBALS_NAVIGATION } from "../admin/admin-navigation.config";
import { groupGlobals } from "../admin/group-collections";

import { Destination } from "./destination";
import { ExperiencesHub } from "./experiences-hub";
import { Footer } from "./footer";
import { Header } from "./header";
import { Homepage } from "./homepage";
import { RoutesHub } from "./routes-hub";
import { SiteSettings } from "./site-settings";

const rawGlobals: GlobalConfig[] = [
	Homepage,
	Destination,
	RoutesHub,
	ExperiencesHub,
	SiteSettings,
	Header,
	Footer
];

export const globals = groupGlobals(rawGlobals, ADMIN_ALL_GLOBALS_NAVIGATION);
