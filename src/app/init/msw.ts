import { setupWorker } from "msw/browser";

import { tourCatalogHandlers } from "@/entities/tour/catalog/handlers";

export const worker = setupWorker(...tourCatalogHandlers);
