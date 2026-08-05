"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/shared/hooks";

import { useGetAuthAccountQuery } from "@/entities/auth";
import { login, logout } from "@/entities/user";

export function AuthBootstrap() {
	const dispatch = useAppDispatch();
	const { data, isError, isSuccess } = useGetAuthAccountQuery(undefined, {
		refetchOnMountOrArgChange: true
	});

	useEffect(() => {
		if (isSuccess && data) {
			dispatch(login());
			return;
		}

		if (isError) {
			dispatch(logout());
		}
	}, [data, dispatch, isError, isSuccess]);

	return null;
}
