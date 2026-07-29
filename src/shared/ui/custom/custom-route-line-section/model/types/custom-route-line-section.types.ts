import type {
	TRouteLineEndpointProps,
	TRouteLineItemProps
} from "@/shared/ui/blocks/types/block-render.types";

export type TRouteLineSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	start?: TRouteLineEndpointProps;
	end?: TRouteLineEndpointProps;
	items: TRouteLineItemProps[];
};
