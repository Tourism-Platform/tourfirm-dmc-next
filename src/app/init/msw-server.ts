import { setupServer } from "msw/node";

import { tourCatalogHandlers } from "@/entities/tour/catalog/handlers";
import { tourPreviewTourHandlers } from "@/entities/tour/preview-tour/handlers";

export const server = setupServer(
	...tourCatalogHandlers,
	...tourPreviewTourHandlers
);
