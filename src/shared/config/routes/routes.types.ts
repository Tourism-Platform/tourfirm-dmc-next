import { ENUM_PATH } from "./routes.config";

export type TMainPath = (typeof ENUM_PATH.MAIN)[keyof typeof ENUM_PATH.MAIN];
export type TPartnersPath =
	(typeof ENUM_PATH.PARTNERS)[keyof typeof ENUM_PATH.PARTNERS];
export type TCompanyPath =
	(typeof ENUM_PATH.COMPANY)[keyof typeof ENUM_PATH.COMPANY];
export type TLegalPath = (typeof ENUM_PATH.LEGAL)[keyof typeof ENUM_PATH.LEGAL];
export type THelpPath = (typeof ENUM_PATH.HELP)[keyof typeof ENUM_PATH.HELP];

export type ENUM_PATH_TYPE =
	| TMainPath
	| TPartnersPath
	| TCompanyPath
	| TLegalPath
	| THelpPath;

export type TQueryParams = {
	[ENUM_PATH.MAIN.TOURS]: {
		destination?: string;
		checkIn?: string;
		checkOut?: string;
	};
};
