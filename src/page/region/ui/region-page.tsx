import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Cms } from "@/widgets/cms";

type TProps = {
	sections: TBlockRenderProps[];
};

export function RegionPage({ sections }: TProps) {
	return <Cms sections={sections} />;
}
