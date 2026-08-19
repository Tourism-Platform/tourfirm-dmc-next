import type {
	BOOKING_ORDER_PATHS,
	BookingCreate,
	BookingPaxFilesModel,
	BookingUpdate,
	PaxCreate,
	PaxFileRef,
	PaxListResponse,
	PaxUpdate,
	PaxWithFiles
} from "@/shared/api";

export type TBookingModelBackend =
	typeof BOOKING_ORDER_PATHS.createBookingOrder._types.response;
export type TBookingCreateBackend = BookingCreate;
export type TBookingUpdateBackend = BookingUpdate;

export type TPaxCreateBackend = PaxCreate;
export type TPaxUpdateBackend = PaxUpdate;
export type TPaxFileRefBackend = PaxFileRef;
export type TBookingPaxBackend = PaxWithFiles;
export type TBookingPaxListBackendResponse = PaxListResponse;
export type TBookingPaxFilesBackend = BookingPaxFilesModel;
