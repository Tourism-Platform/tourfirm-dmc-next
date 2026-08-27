"use client";

import { useCallback, useState } from "react";

import { ENUM_IMAGE_STATUS, type ENUM_IMAGE_STATUS_TYPE } from "@/shared/types";

export const useImageStatus = (src?: string | null) => {
	const [prevSrc, setPrevSrc] = useState(src);
	const [status, setStatus] = useState<ENUM_IMAGE_STATUS_TYPE>(
		src ? ENUM_IMAGE_STATUS.LOADING : ENUM_IMAGE_STATUS.ERROR
	);
	if (src !== prevSrc) {
		setPrevSrc(src);
		setStatus(src ? ENUM_IMAGE_STATUS.LOADING : ENUM_IMAGE_STATUS.ERROR);
	}

	const onLoad = useCallback(() => {
		setStatus(ENUM_IMAGE_STATUS.LOADED);
	}, []);

	const onError = useCallback(() => {
		setStatus(ENUM_IMAGE_STATUS.ERROR);
	}, []);

	return {
		isLoaded: status === ENUM_IMAGE_STATUS.LOADED,
		isLoading: status === ENUM_IMAGE_STATUS.LOADING,
		isError: status === ENUM_IMAGE_STATUS.ERROR,
		onLoad,
		onError
	};
};
