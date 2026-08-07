import type { GlobalConfig } from "payload";

import { ADMIN_ALL_GLOBALS_NAVIGATION } from "../admin/admin-navigation.config";
import { groupGlobals } from "../admin/group-collections";

import { BlogHub } from "./blog-hub";
import { Catalog } from "./catalog";
import { Destination } from "./destination";
import { ExperiencesHub } from "./experiences-hub";
import { Footer } from "./footer";
import { Header } from "./header";
import { Homepage } from "./homepage";
import { NewsHub } from "./news-hub";
import { RoutesHub } from "./routes-hub";
import { SiteSettings } from "./site-settings";
import { TradeFairsHub } from "./trade-fairs-hub";
import { UiBooking } from "./ui-booking";
import { UiCatalog } from "./ui-catalog";
import { UiCommon } from "./ui-common";
import { UiDiscovery } from "./ui-discovery";
import { UiLogin } from "./ui-login";
import { UiPreview } from "./ui-preview";

const rawGlobals: GlobalConfig[] = [
	Homepage,
	Catalog,
	Destination,
	RoutesHub,
	ExperiencesHub,
	TradeFairsHub,
	BlogHub,
	NewsHub,
	SiteSettings,
	Header,
	Footer,
	UiCommon,
	UiCatalog,
	UiDiscovery,
	UiLogin,
	UiPreview,
	UiBooking
];

export const globals = groupGlobals(rawGlobals, ADMIN_ALL_GLOBALS_NAVIGATION);
