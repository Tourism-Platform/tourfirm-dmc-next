import type { TypedLocale } from "payload";

import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Catalog } from "@/widgets/catalog";

type TProps = {
	locale: TypedLocale;
	sections: TBlockRenderProps[];
};

export function CatalogPage({ sections }: TProps) {
	return <Catalog sections={sections} />;
}
