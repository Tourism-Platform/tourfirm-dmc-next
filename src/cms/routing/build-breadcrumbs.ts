export type TBreadcrumbConfig = {
	hub?: { label: string; routeKey?: string; href?: string }[];
	detail?: { includeEntityTitle?: boolean };
};
