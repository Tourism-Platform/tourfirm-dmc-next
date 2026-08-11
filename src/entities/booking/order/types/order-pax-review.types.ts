import type { Gender } from "./gender.types";

export type TPaxReviewFile = {
	id: string;
	fileName: string;
};

export type TPaxReviewDetail = {
	id: string;
	type: string;
	value: string;
	file?: TPaxReviewFile;
};

export type TPaxReviewItem = {
	id: string;
	fullName: string;
	gender: Gender;
	nationality: string;
	dateOfBirth: string;
	passportNumber: string;
	expiredDate: string;
	items: TPaxReviewDetail[];
};
