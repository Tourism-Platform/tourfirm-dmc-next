import type { TBreadcrumbItem } from "@/shared/lib";
import type { TBlockRenderProps } from "@/shared/ui/blocks";
import { BlocksLayout } from "@/shared/ui/blocks";

type TProps = {
	sections: TBlockRenderProps[];
	breadcrumbItems?: TBreadcrumbItem[];
};

export function Cms({ sections, breadcrumbItems }: TProps) {
	return (
		<BlocksLayout sections={sections} breadcrumbItems={breadcrumbItems} />
	);
}
