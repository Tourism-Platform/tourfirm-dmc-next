import type { TQueryParams } from "./routes.types";

type TRouteWithParams<T extends string> =
	T extends `${string}:${infer Param}/${infer Rest}`
		? { [K in Param | keyof TRouteWithParams<Rest>]: string }
		: T extends `${string}:${infer Param}`
			? { [K in Param]: string }
			: never;

export const buildRoute = <T extends string>(
	template: T,
	...args: keyof TRouteWithParams<T> extends never
		? []
		: [TRouteWithParams<T>]
): string => {
	const [params] = args;
	if (!params) return template;

	return Object.entries(params).reduce(
		(path, [key, value]) => path.replace(`:${key}`, String(value)),
		template as string
	);
};

export const buildRouteWithQuery = <TPath extends keyof TQueryParams>(
	path: TPath,
	query?: TQueryParams[TPath]
): string => {
	if (!query || Object.keys(query).length === 0) return path;

	const searchParams = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value) searchParams.set(key, String(value));
	});

	return `${path}?${searchParams.toString()}`;
};
