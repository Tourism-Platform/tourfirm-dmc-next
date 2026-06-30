import type { GlobalConfig } from "payload";

import { ADMIN_GLOBALS_NAVIGATION } from "../admin/admin-navigation.config";
import { groupGlobals } from "../admin/group-collections";

import { Destination } from "./destination";
import { Footer } from "./footer";
import { Header } from "./header";
import { Homepage } from "./homepage";
import { SiteSettings } from "./site-settings";

const rawGlobals: GlobalConfig[] = [
	Homepage,
	Destination,
	SiteSettings,
	Header,
	Footer
];

export const globals = groupGlobals(rawGlobals, ADMIN_GLOBALS_NAVIGATION);
