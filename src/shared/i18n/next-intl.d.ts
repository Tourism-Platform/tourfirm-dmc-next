import type { TResources } from "./i18n.config";

declare module "next-intl" {
	interface AppConfig {
		Messages: TResources;
	}
}
