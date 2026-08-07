import type {
	TLandingPagePubSchema,
	TOperatorPreviewPubSchema,
	TTourMetaModel,
	TTourOptionPreviewSchemaOutput,
	TTourOptionPublicResponse,
	TTourSchedulePubSchema
} from "@/shared/api";

export type TPreviewTourBackend = TLandingPagePubSchema;
export type TGetPreviewTourBackendResponse = TTourMetaModel;
export type TPreviewOperatorBackend = TOperatorPreviewPubSchema;
export type TOptionDetailBackend = TTourOptionPublicResponse;
export type TPreviewOptionListItemBackend = TTourOptionPreviewSchemaOutput;
export type TPreviewTourScheduleBackend = TTourSchedulePubSchema;
