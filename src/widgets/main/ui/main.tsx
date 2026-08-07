import {
	BlockType,
	BlocksLayout,
	type TBlockRenderProps
} from "@/shared/ui/blocks";

import { SearchToursBar } from "@/features/tours";

type TProps = {
	sections: TBlockRenderProps[];
};

function withHeroSearchBar(section: TBlockRenderProps): TBlockRenderProps {
	if (section.blockType !== BlockType.hero) {
		return section;
	}

	return {
		...section,
		children: <SearchToursBar className="translate-y-1/2 shadow-lg" />
	};
}

export function Main({ sections }: TProps) {
	return <BlocksLayout sections={sections.map(withHeroSearchBar)} />;
}
