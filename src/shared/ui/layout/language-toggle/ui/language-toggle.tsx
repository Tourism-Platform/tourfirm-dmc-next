"use client";

import { GlobeIcon, Loader } from "lucide-react";
import type { Locale } from "next-intl";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { type FC, useId, useTransition } from "react";

import { routing, usePathname, useRouter } from "@/shared/i18n";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui";
import type { TDropdownLanguage } from "@/shared/ui-content";

type TProps = {
	languages?: TDropdownLanguage[];
};

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

	const items =
		languages.length > 0
			? languages
			: routing.locales.map((code) => ({ code, label: code }));

	return (
		<Select
			value={locale}
			disabled={isPending}
			onValueChange={(value) => onSelectChange(value as Locale)}
		>
			<SelectTrigger
				id={`language-${id}`}
				className="h-8 border-none px-2 shadow-none hover:bg-accent hover:text-accent-foreground [&>svg]:shrink-0 [&>svg]:text-muted-foreground/80"
				aria-label="Select language"
			>
				{isPending ? (
					<Loader
						className="size-4 animate-spin"
						aria-hidden="true"
					/>
				) : (
					<GlobeIcon size={16} aria-hidden="true" />
				)}
				<SelectValue className="hidden sm:inline-flex" />
			</SelectTrigger>

			<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
				{items.map((language) => (
					<SelectItem key={language.code} value={language.code}>
						<span className="flex items-center gap-2">
							<span className="truncate">{language.label}</span>
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
