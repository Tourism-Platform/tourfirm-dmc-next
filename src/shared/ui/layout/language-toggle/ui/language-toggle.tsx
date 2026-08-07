"use client";

import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";
import { Loader } from "lucide-react";
import type { Locale } from "next-intl";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { type FC, type JSX, useId, useMemo, useTransition } from "react";

import { routing, usePathname, useRouter } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	buttonVariants
} from "@/shared/ui";
import type { TDropdownLanguage } from "@/shared/ui-content";

import { mapLocaleToFlagCountry } from "../lib/map-locale-to-flag-country";

type TProps = {
	languages?: TDropdownLanguage[];
};

type TFlagComponent = (props: {
	title?: string;
	className?: string;
}) => JSX.Element;

function LocaleFlag({ code, title }: { code: string; title?: string }) {
	const country = mapLocaleToFlagCountry(code);
	if (!hasFlag(country)) return null;

	const Flag = Flags[country as keyof typeof Flags] as
		| TFlagComponent
		| undefined;
	if (!Flag) return null;

	return (
		<span className="flex h-3.5 w-5 shrink-0 overflow-hidden rounded-sm bg-foreground/10">
			<Flag className="size-full" title={title ?? country} />
		</span>
	);
}

export const LanguageToggle: FC<TProps> = ({ languages = [] }) => {
	const id = useId();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const [isPending, startTransition] = useTransition();

	function onSelectChange(nextLocale: Locale) {
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- pathname and params always match for current route
				{ pathname, params },
				{ locale: nextLocale }
			);
		});
	}

	const items = useMemo(
		() =>
			languages.length > 0
				? languages
				: routing.locales.map((code) => ({ code, label: code })),
		[languages]
	);

	const activeCode = locale.toUpperCase();

	return (
		<Select
			value={locale}
			disabled={isPending}
			onValueChange={(value) => onSelectChange(value as Locale)}
		>
			<SelectTrigger
				id={`language-${id}`}
				className={cn(
					buttonVariants({ variant: "outline", size: "sm" }),
					"h-8 w-auto gap-1.5 px-2.5 shadow-xs hover:bg-primary/10",
					"[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-50"
				)}
				aria-label="Select language"
			>
				{isPending ? (
					<Loader
						className="size-4 animate-spin"
						aria-hidden="true"
					/>
				) : (
					<>
						<LocaleFlag code={locale} title={activeCode} />
						<span className="text-sm font-medium uppercase">
							{activeCode}
						</span>
					</>
				)}
			</SelectTrigger>

			<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
				{items.map((language) => (
					<SelectItem key={language.code} value={language.code}>
						<span className="flex items-center gap-2">
							<LocaleFlag
								code={language.code}
								title={language.label}
							/>
							<span className="truncate">{language.label}</span>
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
