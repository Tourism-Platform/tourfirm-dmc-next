import type { TypedLocale } from "payload";

import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Tours } from "@/widgets/tours";

type TProps = {
	locale: TypedLocale;
	sections: TBlockRenderProps[];
};

export function ToursPage({ sections }: TProps) {
	return <Tours sections={sections} />;
}
