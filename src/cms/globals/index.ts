import type { GlobalConfig } from "payload";

import { Destination } from "./destination";
import { Footer } from "./footer";
import { Header } from "./header";
import { Homepage } from "./homepage";
import { SiteSettings } from "./site-settings";

export const globals: GlobalConfig[] = [
	Homepage,
	Destination,
	SiteSettings,
	Header,
	Footer
];
