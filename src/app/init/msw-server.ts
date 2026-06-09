import { setupServer } from "msw/node";

import { tourCatalogHandlers } from "@/entities/tour/catalog/handlers";

export const server = setupServer(...tourCatalogHandlers);
