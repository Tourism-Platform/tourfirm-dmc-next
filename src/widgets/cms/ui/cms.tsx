import type { TBlockRenderProps } from "@/shared/ui/blocks";
import { BlocksLayout } from "@/shared/ui/blocks";

type TProps = {
	sections: TBlockRenderProps[];
};

export function Cms({ sections }: TProps) {
	return <BlocksLayout sections={sections} />;
}
