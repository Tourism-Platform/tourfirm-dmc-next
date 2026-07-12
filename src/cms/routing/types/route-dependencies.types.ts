import type { Destination, Experience, Route } from "@/payload-types";

export type TRouteDependencies = {
	destination?: Destination | null;
	similarExperiences?: Experience[];
	themeRoutes?: Route[];
	themeExperiences?: Experience[];
};
