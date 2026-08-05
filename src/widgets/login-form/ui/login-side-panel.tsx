"use client";

import type { FC } from "react";

import { useUiContent } from "@/shared/ui-content";

export const LoginSidePanel: FC = () => {
	const { login } = useUiContent();
	const { sidePanel } = login;

	return (
		<div className="relative hidden overflow-hidden lg:block">
			<div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a] via-[#14508f] to-[#37bffa]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(55,191,250,0.35),transparent_50%)]" />
			<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.06)_100%),linear-gradient(0deg,transparent_95%,rgba(255,255,255,0.06)_100%)] bg-[length:48px_48px]" />

			<div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
				<div className="space-y-4">
					<p className="text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
						{sidePanel.brandLabel}
					</p>
					<h2 className="max-w-md text-4xl leading-tight font-semibold text-white xl:text-5xl">
						{sidePanel.title}
					</h2>
					<p className="max-w-sm text-base text-white/80">
						{sidePanel.subtitle}
					</p>
				</div>

				<blockquote className="max-w-sm border-l-2 border-white/40 pl-4 text-sm text-white/75 italic">
					{sidePanel.quote}
				</blockquote>
			</div>
		</div>
	);
};
