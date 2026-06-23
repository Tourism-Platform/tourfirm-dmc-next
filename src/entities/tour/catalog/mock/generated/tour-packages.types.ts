import type { ICatalogTourBackend } from "../../types";
import type {
	ICatalogPreviewOperatorBackend,
	ICatalogPreviewTourGeneralBackend,
	ICatalogPreviewTourLandingBackend
} from "../../types/catalog-preview-backend.types";

export interface ITourPackageMockBundle {
	catalog: ICatalogTourBackend;
	general: ICatalogPreviewTourGeneralBackend;
	landing: ICatalogPreviewTourLandingBackend;
	operator: ICatalogPreviewOperatorBackend;
}
