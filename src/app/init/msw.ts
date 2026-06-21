import { setupWorker } from "msw/browser";

import { tourCatalogHandlersAll } from "@/entities/tour/catalog/handlers";

export const worker = setupWorker(...tourCatalogHandlersAll);
