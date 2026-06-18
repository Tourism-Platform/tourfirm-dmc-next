import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Destinations } from "@/widgets/destinations";

type TProps = {
	sections: TBlockRenderProps[];
};

export function DestinationsPage({ sections }: TProps) {
	return <Destinations sections={sections} />;
}
