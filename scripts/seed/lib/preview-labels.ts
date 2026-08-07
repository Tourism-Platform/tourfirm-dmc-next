import { convertKeysDeep } from "./convert-keys.js";

export function buildPreviewLabelsFromOptions(
	options: Record<string, unknown>
): Record<string, unknown> {
	const tour = options.tour as Record<string, unknown> | undefined;

	return convertKeysDeep({
		languages: tour?.languages ?? {},
		pickup: tour?.pickup ?? {}
	});
}

export function buildPreviewLabelsTemplate(
	options: Record<string, unknown>
): Record<string, unknown> {
	return {
		languages: (options.tour as Record<string, unknown> | undefined)
			?.languages,
		pickup: (options.tour as Record<string, unknown> | undefined)?.pickup
	};
}
