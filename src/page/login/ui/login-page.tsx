"use client";

import { useEffect } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useRouter } from "@/shared/i18n";

import { useGetAuthAccountQuery } from "@/entities/auth";

import { LoginForm, LoginSidePanel } from "@/widgets/login-form";

export function LoginPage() {
	const router = useRouter();
	const { data: authAccount, isSuccess } = useGetAuthAccountQuery(undefined, {
		refetchOnMountOrArgChange: true
	});

	useEffect(() => {
		if (isSuccess && authAccount) {
			router.replace(ENUM_PATH.MAIN.ROOT);
		}
	}, [authAccount, isSuccess, router]);

	return (
		<div className="relative grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
			<div className="relative flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(55,191,250,0.12),transparent_55%)] lg:hidden" />
				<div className="relative mx-auto w-full max-w-md">
					<LoginForm />
				</div>
			</div>

			<LoginSidePanel />
		</div>
	);
}
