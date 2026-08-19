"use client";

import type { ReactNode } from "react";

import { ENUM_PATH } from "@/shared/config";
import { usePathname } from "@/shared/i18n";

type TProps = {
	children: ReactNode;
	header: ReactNode;
	footer: ReactNode;
};

export function LocaleShell({ children, header, footer }: TProps) {
	const pathname = usePathname();
	const isLogin = pathname === ENUM_PATH.AUTH.LOGIN;

	if (isLogin) {
		return (
			<main className="flex min-h-screen w-full flex-col">
				{children}
			</main>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex min-h-screen flex-col">
				{header}
				<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
					{children}
				</main>
			</div>
			{footer}
		</div>
	);
}
