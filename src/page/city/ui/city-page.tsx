import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { Cms } from "@/widgets/cms";

type TProps = {
	sections: TBlockRenderProps[];
	breadcrumbItems?: TBreadcrumbItem[];
};

export function CityPage({ sections, breadcrumbItems }: TProps) {
	return <Cms sections={sections} breadcrumbItems={breadcrumbItems} />;
}
