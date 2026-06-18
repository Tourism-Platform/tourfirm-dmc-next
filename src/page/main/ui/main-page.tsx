import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Main } from "@/widgets/main";

type TProps = {
	sections: TBlockRenderProps[];
};

export function MainPage({ sections }: TProps) {
	return <Main sections={sections} />;
}
