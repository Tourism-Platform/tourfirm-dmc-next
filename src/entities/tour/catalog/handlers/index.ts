import { catalogPreviewHandlers } from "./catalog-preview.handlers";
import { tourCatalogHandlers } from "./catalog-tour.handlers";

export { tourCatalogHandlers } from "./catalog-tour.handlers";
export { catalogPreviewHandlers } from "./catalog-preview.handlers";

export const tourCatalogHandlersAll = [
	...tourCatalogHandlers,
	...catalogPreviewHandlers
];
