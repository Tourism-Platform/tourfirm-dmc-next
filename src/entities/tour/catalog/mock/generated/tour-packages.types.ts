import type { ICatalogTourBackend } from "../../types";
import type {
	ICatalogPreviewOperatorBackend,
	ICatalogPreviewOptionDetailBackend,
	ICatalogPreviewOptionListItemBackend,
	ICatalogPreviewTourGeneralBackend,
	ICatalogPreviewTourLandingBackend,
	TCatalogPreviewPubEvent
} from "../../types/catalog-preview-backend.types";
import type { TPubEventMediaFields } from "../../types/catalog-preview-option-media.types";

export type TAppLocale = "en" | "ru" | "uz";

export interface ITourPackageMockBundle {
	catalog: ICatalogTourBackend;
	general: ICatalogPreviewTourGeneralBackend;
	landing: ICatalogPreviewTourLandingBackend;
	operator: ICatalogPreviewOperatorBackend;
	options: ICatalogPreviewOptionListItemBackend[];
	optionDetail: Omit<ICatalogPreviewOptionDetailBackend, "events"> & {
		events: Array<TCatalogPreviewPubEvent & TPubEventMediaFields>;
	};
}
