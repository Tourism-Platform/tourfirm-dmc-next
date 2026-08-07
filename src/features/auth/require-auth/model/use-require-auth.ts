"use client";

import { useEffect } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useRouter } from "@/shared/i18n";

import { useGetAuthAccountQuery } from "@/entities/auth";

type TRequireAuthResult = {
	isReady: boolean;
	isChecking: boolean;
};

export function useRequireAuth(): TRequireAuthResult {
	const router = useRouter();
	const { isError, isLoading, isSuccess, isFetching } =
		useGetAuthAccountQuery(undefined, {
			refetchOnMountOrArgChange: true
		});

	useEffect(() => {
		if (isError) {
			router.replace(ENUM_PATH.AUTH.LOGIN);
		}
	}, [isError, router]);

	return {
		isReady: isSuccess && !isError,
		isChecking: isLoading || (isFetching && !isSuccess)
	};
}
