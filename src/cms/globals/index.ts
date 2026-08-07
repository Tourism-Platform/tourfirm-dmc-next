import type { GlobalConfig } from "payload";

import { ADMIN_ALL_GLOBALS_NAVIGATION } from "../admin/admin-navigation.config";
import { groupGlobals } from "../admin/group-collections";

import { BlogHub } from "./blog-hub";
import { Destination } from "./destination";
import { ExperiencesHub } from "./experiences-hub";
import { Footer } from "./footer";
import { Header } from "./header";
import { Homepage } from "./homepage";
import { NewsHub } from "./news-hub";
import { RoutesHub } from "./routes-hub";
import { SiteSettings } from "./site-settings";
import { Tours } from "./tours";
import { TradeFairsHub } from "./trade-fairs-hub";
import { UiBooking } from "./ui-booking";
import { UiCatalog } from "./ui-catalog";
import { UiCommon } from "./ui-common";
import { UiDiscovery } from "./ui-discovery";
import { UiLogin } from "./ui-login";
import { UiOrders } from "./ui-orders";
import { UiPreview } from "./ui-preview";
import { UiTours } from "./ui-tours";

const rawGlobals: GlobalConfig[] = [
	Homepage,
	Tours,
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
	UiTours,
	UiCatalog,
	UiOrders,
	UiDiscovery,
	UiLogin,
	UiPreview,
	UiBooking
];

export const globals = groupGlobals(rawGlobals, ADMIN_ALL_GLOBALS_NAVIGATION);
