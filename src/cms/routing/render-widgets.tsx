import type { ReactNode } from "react";

import type { TDiscoveryPaginationKey } from "@/shared/ui-content";
import { loadUiContent } from "@/shared/ui-content/server";
import { CmsPagination } from "@/shared/ui/pagination";

import { DiscoveryFilterBar, ExperienceMetaBar } from "@/widgets/discovery";

import type { TRouteRuntimeEntry } from "./types/route-runtime.types";
import type { TWidgetModel } from "./widgets/widget-model.types";

export type TRenderedWidgets = {
	beforeCms: ReactNode[];
	afterCms: ReactNode[];
};

export async function renderWidgets(
	models: TWidgetModel[],
	runtime: TRouteRuntimeEntry,
	locale: string
): Promise<TRenderedWidgets> {
	const uiContent = await loadUiContent(locale);
	const placement = runtime.layout.widgetPlacement ?? "afterCms";
	const beforeCms: ReactNode[] = [];
	const afterCms: ReactNode[] = [];

	for (const model of models) {
		const node = await renderWidgetNode(
			model,
			runtime,
			uiContent.discovery
		);

		if (!node) {
			continue;
		}

		if (placement === "beforeCms") {
			beforeCms.push(node);
		} else {
			afterCms.push(node);
		}
	}

	return { beforeCms, afterCms };
}

async function renderWidgetNode(
	model: TWidgetModel,
	runtime: TRouteRuntimeEntry,
	discovery: Awaited<ReturnType<typeof loadUiContent>>["discovery"]
): Promise<ReactNode | null> {
	switch (model.key) {
		case "pagination": {
			const paginationKey = runtime.presentation.paginationKey;

			if (!paginationKey) {
				return null;
			}

			const labels = discovery[paginationKey as TDiscoveryPaginationKey];
			const props = model.props as {
				baseHref: string;
				pagination: {
					page: number;
					totalPages: number;
					hasNextPage: boolean;
					hasPrevPage: boolean;
				};
			};

			return (
				<CmsPagination
					baseHref={props.baseHref}
					pagination={props.pagination}
					prevLabel={labels.paginationPrev}
					nextLabel={labels.paginationNext}
					ariaLabel={discovery.paginationAriaLabel}
				/>
			);
		}
		case "experienceMeta":
			return (
				<div className="flex w-full flex-col gap-12 py-16 sm:gap-14 sm:py-20 lg:gap-16">
					<ExperienceMetaBar
						{...(model.props as Parameters<
							typeof ExperienceMetaBar
						>[0])}
					/>
				</div>
			);
		case "discoveryFilterBar":
			return (
				<div className="flex w-full flex-col gap-8 py-10">
					<DiscoveryFilterBar
						filters={
							model.props.filters as Parameters<
								typeof DiscoveryFilterBar
							>[0]["filters"]
						}
					/>
				</div>
			);
		default:
			return null;
	}
}
