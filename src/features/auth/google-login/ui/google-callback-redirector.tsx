"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/shared/hooks";

import { useLazyGoogleCallbackQuery } from "@/entities/auth";
import { login } from "@/entities/user";

function cleanupUrlQuery() {
	const { pathname, hash } = window.location;
	window.history.replaceState({}, "", `${pathname}${hash}`);
}

function buildCallbackParams(
	searchParams: URLSearchParams
): Record<string, string> {
	const params: Record<string, string> = {};

	searchParams.forEach((value, key) => {
		params[key] = value;
	});

	return params;
}

export function GoogleCallbackRedirector() {
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const [googleCallback] = useLazyGoogleCallbackQuery();
	const startedForSearch = useRef<string | null>(null);

	const search = searchParams.toString();
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	useEffect(() => {
		const hasOAuthParams = !!error || !!code;

		if (!hasOAuthParams) return;

		if (startedForSearch.current === search) return;
		startedForSearch.current = search;

		if (error) {
			cleanupUrlQuery();
			return;
		}

		const params = buildCallbackParams(searchParams);

		void googleCallback(params)
			.unwrap()
			.then(() => {
				dispatch(login());
				cleanupUrlQuery();
			})
			.catch(() => {
				cleanupUrlQuery();
			});
	}, [code, dispatch, error, googleCallback, search, searchParams]);

	return null;
}
