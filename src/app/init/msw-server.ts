import { setupServer } from "msw/node";

import { tourCatalogHandlersAll } from "@/entities/tour/catalog/handlers";

export const server = setupServer(...tourCatalogHandlersAll);
