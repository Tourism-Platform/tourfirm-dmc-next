import { setupWorker } from "msw/browser";

import { tourCatalogHandlers } from "@/entities/tour/catalog/handlers";
import { tourPreviewTourHandlers } from "@/entities/tour/preview-tour/handlers";

export const worker = setupWorker(
	...tourCatalogHandlers,
	...tourPreviewTourHandlers
);
