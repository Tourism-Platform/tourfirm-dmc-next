"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAppDispatch } from "@/shared/hooks";

import { useGetAuthAccountQuery } from "@/entities/auth";
import { login, logout } from "@/entities/user";

function hasOAuthCallbackParams(searchParams: URLSearchParams): boolean {
	return Boolean(searchParams.get("code") || searchParams.get("error"));
}

export function AuthBootstrap() {
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const isOAuthCallback = hasOAuthCallbackParams(searchParams);

	const { data, isError, isSuccess } = useGetAuthAccountQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: isOAuthCallback
	});

	useEffect(() => {
		if (isOAuthCallback) return;

		if (isSuccess && data) {
			dispatch(login());
			return;
		}

		if (isError) {
			dispatch(logout());
		}
	}, [data, dispatch, isError, isOAuthCallback, isSuccess]);

	return null;
}
