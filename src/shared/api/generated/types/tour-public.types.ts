import type {
	Currency,
	LandingPagePubSchema,
	LocationOutSchema,
	MonetaryValueSchema,
	MultiEventPubOutput,
	OperatorPreviewPubSchema,
	TourMetaResponse,
	TourOptionPreviewSchemaOutput,
	TourOptionPublicResponse,
	TourSchedulePubSchema
} from "../Api";

/** DMC aliases over OpenAPI types from Api.ts (do not duplicate Api exports). */
export type TCurrency = Currency | (string & {});

export type TMonetaryValueSchema = MonetaryValueSchema;
export type TLandingPagePubSchema = LandingPagePubSchema;
export type TTourMetaModel = TourMetaResponse;
export type TOperatorPreviewPubSchema = OperatorPreviewPubSchema;
export type TTourOptionPreviewSchemaOutput = TourOptionPreviewSchemaOutput;
export type TTourOptionPublicResponse = TourOptionPublicResponse;
export type TTourSchedulePubSchema = TourSchedulePubSchema;
export type TLocationOutSchema = LocationOutSchema;
export type TMultiEventPubOutput = MultiEventPubOutput;
export type TPubEvent = TourOptionPublicResponse["events"][number];
