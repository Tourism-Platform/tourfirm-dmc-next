import { MESSAGE_NAMESPACES, type TMessageNamespace } from "./i18n.config";

export const messageNamespaces = [...MESSAGE_NAMESPACES] as const;

export async function loadMessages(
	locale: string
): Promise<Record<TMessageNamespace, Record<string, unknown>>> {
	const entries = await Promise.all(
		messageNamespaces.map(async (ns) => {
			const mod = await import(`../../../messages/${locale}/${ns}.json`);
			return [ns, mod.default] as const;
		})
	);

	return Object.fromEntries(entries) as Record<
		TMessageNamespace,
		Record<string, unknown>
	>;
}
