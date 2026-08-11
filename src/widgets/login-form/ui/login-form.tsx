"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Button,
	Card,
	CardContent,
	LanguageToggle,
	ThemeToggle
} from "@/shared/ui";
import { type TDropdownLanguage, useUiContent } from "@/shared/ui-content";

import { useGoogleLogin } from "@/features/auth";

import { GoogleIcon } from "./google-icon";

const LOGO_SRC = "/assets/images/logo.svg";

type TProps = {
	languages?: TDropdownLanguage[];
};

export const LoginForm: FC<TProps> = ({ languages = [] }) => {
	const { login, footer } = useUiContent();
	const { handleGoogleLogin } = useGoogleLogin();

	return (
		<Card className="relative w-full max-w-md border-border/60 bg-card/80 shadow-xl backdrop-blur-sm">
			<Button
				variant="ghost"
				type="button"
				size="icon"
				className="absolute left-3 top-3 z-10 text-muted-foreground hover:text-foreground"
				asChild
			>
				<Link href={ENUM_PATH.MAIN.ROOT} aria-label="Back">
					<ArrowLeft className="size-4" />
				</Link>
			</Button>

			<div className="absolute right-3 top-3 z-10 flex items-center gap-2">
				<ThemeToggle />
				<LanguageToggle languages={languages} />
			</div>

			<CardContent className="flex flex-col gap-6 p-6 pt-12 sm:p-8 sm:pt-14">
				<div className="flex flex-col items-center gap-4 text-center">
					<Link
						href={ENUM_PATH.MAIN.ROOT}
						className="flex items-center gap-2"
					>
						<Image
							src={LOGO_SRC}
							alt={footer.brand.name}
							width={40}
							height={40}
							className="h-10 w-auto"
						/>
						<span className="text-2xl font-semibold">
							<span className="text-foreground">Tour</span>
							<span className="text-[#37bffa]">Link</span>
						</span>
					</Link>

					<div className="space-y-1">
						<h1 className="text-2xl font-semibold tracking-tight">
							{login.form.title}
						</h1>
						<p className="text-muted-foreground text-sm text-balance">
							{login.form.description}
						</p>
					</div>
				</div>

				<Button
					variant="outline"
					type="button"
					size="lg"
					className="h-11 w-full gap-3 bg-background text-base font-medium shadow-sm transition-colors hover:bg-muted/50"
					onClick={handleGoogleLogin}
				>
					<GoogleIcon className="size-5 shrink-0" />
					{login.form.googleButton}
				</Button>

				<p className="text-muted-foreground text-center text-xs leading-relaxed">
					{login.form.trustNote}
				</p>
			</CardContent>
		</Card>
	);
};
